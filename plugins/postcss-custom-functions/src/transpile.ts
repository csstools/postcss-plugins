import type { AtRule, ChildNode, Declaration, Helpers, Rule } from 'postcss';
import type { ComponentValue, FunctionNode } from '@csstools/css-parser-algorithms';
import {
	FunctionNode as CSSAFunctionNode,
	TokenNode as CSSATokenNode,
	isFunctionNode,
	isSimpleBlockNode,
	isTokenNode,
	isWhiteSpaceOrCommentNode,
	parseCommaSeparatedListOfComponentValues,
	parseListOfComponentValues,
	replaceComponentValues,
	stringify,
} from '@csstools/css-parser-algorithms';
import { TokenType, isTokenComma, isTokenFunction, isTokenIdent, isTokenOpenCurly, mutateIdent, tokenize } from '@csstools/css-tokenizer';
import type { CustomFunctionDefinition, CustomFunctionGroup } from './custom-functions-from-root';
import type { FunctionParameter } from '@csstools/custom-function-parser';
import { parameterType } from './classify';
import { GeneratedNames, INVALID_IDENT, sourceHashFor } from './generated-names';
import { CSS_WIDE_KEYWORDS } from './css-wide-keywords';
import { registeredPropertyNames, rewritePropertyNames } from '@csstools/utilities';

// Custom functions can call each other and duplicate their bodies, which can
// grow exponentially. Bound the total number of declarations generated while
// transpiling so that a small stylesheet can not exhaust memory or CPU.
const MAX_GENERATED_DECLARATIONS = 100_000;
const IS_PROPERTY_REGEX = /^property$/i;

/**
 * A single lexical scope while evaluating a custom function.
 *
 * Maps the authored custom property names (`--x`) that are visible in this
 * scope to the generated, collision free names that are emitted into the CSS.
 */
class Scope {
	names: Map<string, string> = new Map();
	registeredNames: Set<string> = new Set();
	parent: Scope | null;

	constructor(parent: Scope | null) {
		this.parent = parent;
	}

	get(name: string): string | undefined {
		const value = this.names.get(name);
		if (value !== undefined) {
			return value;
		}

		return this.parent?.get(name);
	}
}

type CallFrame = {
	name: string,
	cyclic: boolean,
};

/**
 * Transpiles `<dashed-function>` calls into a form that works without native
 * custom function support.
 *
 * The evaluation model follows the spec closely: the function body is emitted
 * as custom property declarations on the element where the function is called,
 * with a generated name per parameter, local variable and result. The browser
 * then performs the actual `var()` substitution, type checking, cascade and
 * conditional handling.
 *
 * When a name has several definitions (layers and/or conditional rules), one
 * result property is shared and each definition writes to it inside its own
 * conditional context. Definitions are emitted weakest first so the browser
 * cascade selects the strongest *active* definition at runtime.
 */
export class CustomFunctionTranspiler {
	private customFunctions: Map<string, CustomFunctionGroup> = new Map();
	private counter = 0;
	private frames: Array<CallFrame> = [];
	private registrations: Array<ChildNode> = [];
	private names: GeneratedNames = new GeneratedNames('0');
	private budget = MAX_GENERATED_DECLARATIONS;
	private emittedNodes: Array<ChildNode> = [];

	setCustomFunctions(customFunctions: Map<string, CustomFunctionGroup>): void {
		this.customFunctions = customFunctions;
		this.budget = MAX_GENERATED_DECLARATIONS;
	}

	/** Throws once the total number of generated declarations exceeds the budget. */
	private spendBudget(amount = 1): void {
		this.budget -= amount;
		if (this.budget < 0) {
			throw new Error('Maximum custom function expansion size exceeded, reduce the complexity of your custom functions');
		}
	}

	/**
	 * Take the `@property` registrations generated while transpiling.
	 * These are top level rules and must be appended to the root.
	 */
	getRegisteredPropertyAtRules(): Array<ChildNode> {
		const registrations = this.registrations;
		this.registrations = [];
		return registrations;
	}

	/**
	 * Replace all known custom function calls in a declaration value.
	 * Returns the new value, or `null` when nothing changed.
	 */
	processDeclaration(decl: Declaration, helpers: Helpers): string | null {
		const tokens = tokenize({ css: decl.value });
		if (!tokens.some((token) => isTokenFunction(token) && token[4].value.startsWith('--'))) {
			return null;
		}

		const parent = decl.parent;
		if (!parent || parent.type !== 'rule') {
			return null;
		}

		this.names = new GeneratedNames(sourceHashFor(decl.source?.input.from));

		const element = parent;
		const componentValues = parseListOfComponentValues(tokens);

		// Declarations that can be merged into the calling rule without changing
		// their cascade context.
		const inlineDecls: Array<Declaration> = [];

		// Generated rules are collected here and inserted in a single batch.
		// Inserting them one by one is quadratic: PostCSS resolves the index of
		// the reference node with `indexOf` on every insertion.
		this.emittedNodes = [];

		replaceComponentValues([componentValues], (node) => {
			if (!isFunctionNode(node)) {
				return;
			}

			const name = node.getName();
			if (!name.startsWith('--')) {
				return;
			}

			const group = this.customFunctions.get(name);
			if (!group || !group.supported) {
				return;
			}

			return this.processCall(node, element, new Scope(null), inlineDecls, helpers);
		});

		const modified = stringify([componentValues]);
		if (modified === decl.value && !inlineDecls.length && !this.emittedNodes.length) {
			return null;
		}

		if (this.emittedNodes.length) {
			element.before(this.emittedNodes);
			this.emittedNodes = [];
		}

		// Prepend the inlined declarations so they are available to the call.
		if (inlineDecls.length) {
			decl.before(inlineDecls);
		}

		if (modified === decl.value) {
			return null;
		}

		return modified;
	}

	private processCall(fn: FunctionNode, element: Rule, parentScope: Scope, inlineDecls: Array<Declaration>, helpers: Helpers): Array<ComponentValue> {
		const name = fn.getName();
		const group = this.customFunctions.get(name);

		if (!group || !group.supported) {
			return [this.varReference(INVALID_IDENT)];
		}

		// A function that (indirectly) calls itself is cyclic and evaluates to
		// the guaranteed-invalid value.
		const existingFrame = this.frames.find((frame) => frame.name === name);
		if (existingFrame) {
			existingFrame.cyclic = true;
			return [this.varReference(INVALID_IDENT)];
		}

		const args = this.parseArguments(fn);
		if (!args) {
			return [this.varReference(INVALID_IDENT)];
		}

		// CSS-wide keywords in `result` are left unresolved by the spec, so they
		// must be substituted directly instead of going through `var()`.
		//
		// This is only used when the function is not cyclic. A cycle anywhere in
		// the body makes the whole evaluation invalid.
		const keywordResult = group.definitions.length === 1 ? group.definitions[0].keywordResult : null;

		// Arguments are resolved in the scope of the caller, before the function
		// itself is evaluated.
		const evaluatedArgs = args.map((arg) => {
			return this.rewriteValue(stringify([arg]), element, parentScope, inlineDecls, helpers);
		});

		const callId = (this.counter++).toString(36);
		const resultName = this.resultName(callId);

		const frame: CallFrame = { name, cyclic: false };
		this.frames.push(frame);

		for (const definition of group.definitions) {
			this.emitDefinition(definition, args, evaluatedArgs, element, parentScope, resultName, inlineDecls, helpers);
		}

		// Once a substitution context is marked as cyclic, the whole evaluation
		// returns the guaranteed-invalid value.
		if (frame.cyclic) {
			inlineDecls.push(this.invalidResultDeclaration(resultName, element, helpers));
		}

		this.frames.pop();

		if (frame.cyclic) {
			return [this.varReference(INVALID_IDENT)];
		}

		if (keywordResult) {
			return [new CSSATokenNode([TokenType.Ident, keywordResult, -1, -1, { value: keywordResult }])];
		}

		return [this.varReference(resultName)];
	}

	private emitDefinition(definition: CustomFunctionDefinition, args: Array<Array<ComponentValue>>, evaluatedArgs: Array<string>, element: Rule, parentScope: Scope, resultName: string, inlineDecls: Array<Declaration>, helpers: Helpers): void {
		const parameters = definition.function.parameters;

		// More arguments than parameters is invalid.
		// A parameter without a default value must be provided.
		let validArity = args.length <= parameters.length;
		if (validArity) {
			for (let i = args.length; i < parameters.length; i++) {
				if (!parameters[i].getDefaultValue()) {
					validArity = false;
					break;
				}
			}
		}

		const definitionId = (this.counter++).toString(36);
		const scope = new Scope(parentScope);
		// Default values are resolved in the argument rule, where only the
		// parameters are visible. Body locals must not shadow them.
		const parameterScope = new Scope(parentScope);
		const parameterArgs = new Map<string, string>();

		for (let i = 0; i < parameters.length; i++) {
			const argName = this.argName(definitionId, i);
			scope.names.set(parameters[i].getName(), argName);
			parameterScope.names.set(parameters[i].getName(), argName);
			parameterArgs.set(parameters[i].getName(), argName);
		}

		for (const localName of collectLocalNames(definition.node)) {
			scope.names.set(localName, this.localName(definitionId, localName));
		}

		for (const registeredName of collectRegisteredLocalNames(definition.node)) {
			scope.registeredNames.add(registeredName);
		}

		const nodes: Array<ChildNode> = [];

		if (!validArity) {
			inlineDecls.push(this.invalidResultDeclaration(resultName, element, helpers));
		} else {
			// Only inline when the definition can be evaluated exactly where it
			// is called: no conditional rule around it, no conditional rule in
			// the body, and no cascade layer to preserve.
			const inline = definition.conditionals.length === 0 && definition.layer === false && !hasConditionalBody(definition.node);

			if (inline) {
				// Arguments are prepended to the calling rule, so no extra rule
				// is needed for them.
				this.emitArguments(definitionId, parameters, evaluatedArgs, element, parameterScope, parameterArgs, inlineDecls, inlineDecls, helpers);
			} else {
				const argDecls: Array<Declaration> = [];
				this.emitArguments(definitionId, parameters, evaluatedArgs, element, parameterScope, parameterArgs, argDecls, inlineDecls, helpers);

				if (argDecls.length) {
					nodes.push(...wrapInConditionals([element.clone({ nodes: argDecls })], definition.conditionals));
				}
			}

			for (let i = 0; i < parameters.length; i++) {
				const type = parameterType(parameters[i]);
				if (!type) {
					continue;
				}

				this.spendBudget();

				this.registrations.push(...wrapRegistrationsInConditionals([helpers.atRule({
					name: 'property',
					params: this.argName(definitionId, i),
					nodes: [
						helpers.decl({ prop: 'syntax', value: `"${type}"`, source: element.source }),
						helpers.decl({ prop: 'inherits', value: 'true', source: element.source }),
						helpers.decl({ prop: 'initial-value', value: parameters[i].getDefaultValue(), source: element.source }),
					],
					source: element.source,
				})], definition.conditionals));
			}

			this.emitLocalRegistrations(definition.node, definition.conditionals, definitionId);

			if (inline) {
				this.emitBodyInline(definition.node.nodes || [], element, scope, parameterArgs, definitionId, resultName, inlineDecls, helpers);
			} else {
				nodes.push(...this.emitBody(definition.node.nodes || [], element, scope, parameterArgs, definitionId, resultName, definition.conditionals, helpers));
			}
		}

		if (!nodes.length) {
			return;
		}

		this.emittedNodes.push(...nodes);
	}

	/** Moves local `@property` rules to the root with their generated local names. */
	private emitLocalRegistrations(definition: AtRule, ancestorConditionals: Array<AtRule>, definitionId: string): void {
		for (const { propertyRule, conditionals } of collectPropertyRules(definition)) {
			const registration = propertyRule.clone();
			if (!rewritePropertyNames(registration, (name) => this.localName(definitionId, name))) {
				continue;
			}

			this.spendBudget(countNodes(registration));
			this.registrations.push(...wrapRegistrationsInConditionals([registration], [...ancestorConditionals, ...conditionals]));
		}
	}

	/**
	 * Emit the declarations that bind the arguments to the parameters.
	 */
	private emitArguments(definitionId: string, parameters: Array<FunctionParameter>, evaluatedArgs: Array<string>, element: Rule, parameterScope: Scope, parameterArgs: Map<string, string>, out: Array<Declaration>, inlineDecls: Array<Declaration>, helpers: Helpers): void {
		const outStart = out.length;

		for (let i = 0; i < parameters.length; i++) {
			const parameter = parameters[i];
			const type = parameterType(parameter);
			const defaultValue = parameter.getDefaultValue();
			const hasArgument = i < evaluatedArgs.length;

			if (type) {
				// Typed parameters use a generated `@property` registration.
				// The registration provides the default value for missing
				// arguments and for arguments that fail the type check.
				if (hasArgument) {
					out.push(helpers.decl({
						prop: this.argName(definitionId, i),
						value: evaluatedArgs[i],
						source: element.source,
					}));
				} else if (defaultValue) {
					out.push(helpers.decl({
						prop: this.argName(definitionId, i),
						value: this.rewriteDefault(defaultValue, parameter.getName(), element, parameterScope, parameterArgs, inlineDecls, helpers),
						source: element.source,
					}));
				}

				continue;
			}

			// Untyped parameters use a raw + fallback pair so that missing
			// and invalid arguments resolve to the default value.
			if (defaultValue) {
				if (hasArgument) {
					out.push(helpers.decl({
						prop: this.rawName(definitionId, i),
						value: evaluatedArgs[i],
						source: element.source,
					}));
				}

				out.push(helpers.decl({
					prop: this.argName(definitionId, i),
					value: `var(${this.rawName(definitionId, i)}, ${this.rewriteDefault(defaultValue, parameter.getName(), element, parameterScope, parameterArgs, inlineDecls, helpers)})`,
					source: element.source,
				}));

				continue;
			}

			if (hasArgument) {
				out.push(helpers.decl({
					prop: this.argName(definitionId, i),
					value: evaluatedArgs[i],
					source: element.source,
				}));
			}
		}

		this.spendBudget(out.length - outStart);
	}

	/**
	 * Emit a function body into separate rules.
	 *
	 * Used when the body must stay conditional. The `activeConditionals` are the
	 * conditional group rules that currently apply to this level. Declarations
	 * from a nested conditional rule are emitted in a rule wrapped with the
	 * nested rule's condition, on top of the active rules.
	 */
	private emitBody(
		containerNodes: Array<ChildNode>,
		element: Rule,
		scope: Scope,
		parameterArgs: Map<string, string>,
		definitionId: string,
		resultName: string,
		activeConditionals: Array<AtRule>,
		helpers: Helpers,
	): Array<ChildNode> {
		const out: Array<ChildNode> = [];
		let pendingDecls: Array<Declaration> = [];

		const flush = (): void => {
			if (!pendingDecls.length) {
				return;
			}

			out.push(...wrapInConditionals([element.clone({ nodes: pendingDecls })], activeConditionals));
			pendingDecls = [];
		};

		for (const node of containerNodes) {
			if (node.type === 'decl') {
				const processed = this.processBodyDeclaration(node, element, scope, parameterArgs, definitionId, resultName, pendingDecls, helpers);
				if (processed) {
					pendingDecls.push(processed);
				}

				continue;
			}

			if (node.type === 'atrule') {
				if (IS_PROPERTY_REGEX.test(node.name)) {
					continue;
				}

				flush();

				out.push(...this.emitBody(node.nodes || [], element, scope, parameterArgs, definitionId, resultName, [...activeConditionals, node], helpers));

				continue;
			}
		}

		flush();

		return out;
	}

	/**
	 * Emit a function body into a flat declaration list.
	 *
	 * Used when the definition is not guarded by any conditional rule, so all
	 * declarations can be inlined into the calling rule. The body itself may
	 * still contain conditional rules; those are preserved as nested rules.
	 */
	private emitBodyInline(
		containerNodes: Array<ChildNode>,
		element: Rule,
		scope: Scope,
		parameterArgs: Map<string, string>,
		definitionId: string,
		resultName: string,
		out: Array<Declaration>,
		helpers: Helpers,
	): void {
		for (const node of containerNodes) {
			if (node.type === 'decl') {
				const processed = this.processBodyDeclaration(node, element, scope, parameterArgs, definitionId, resultName, out, helpers);
				if (processed) {
					out.push(processed);
				}

				continue;
			}

			if (node.type === 'atrule') {
				if (IS_PROPERTY_REGEX.test(node.name)) {
					continue;
				}

				this.emitBodyInline(node.nodes || [], element, scope, parameterArgs, definitionId, resultName, out, helpers);
			}
		}
	}

	private processBodyDeclaration(decl: Declaration, element: Rule, scope: Scope, parameterArgs: Map<string, string>, definitionId: string, resultName: string, inlineDecls: Array<Declaration>, helpers: Helpers): Declaration | null {
		let prop: string;
		let declaredProp: string | null = null;

		if (decl.prop.toLowerCase() === 'result') {
			prop = resultName;
		} else {
			declaredProp = unescapedPropertyName(decl.prop);
			if (declaredProp === null || !declaredProp.startsWith('--')) {
				// Unknown descriptors are invalid and ignored.
				return null;
			}

			const mapped = scope.get(declaredProp);
			if (!mapped) {
				return null;
			}

			prop = mapped;
		}

		// CSS-wide keywords on custom properties resolve against the property
		// being declared, including when they appear as a `var()` fallback.
		// This runs after the regular rewriting so that the inserted call-site
		// references are not rewritten to the local scope.
		let value = this.rewriteValue(decl.value, element, scope, inlineDecls, helpers);
		if (declaredProp !== null) {
			value = this.resolveBodyKeywords(value, declaredProp, scope, parameterArgs);
		}

		this.spendBudget();

		return decl.clone({
			prop,
			value,
		});
	}

	/**
	 * Resolve CSS-wide keywords that are the value of a custom property,
	 * including keywords that appear as a `var()` fallback.
	 *
	 * `initial` resolves to the parameter's own value (argument or default).
	 * `inherit` resolves to the custom property of the same name in the calling
	 * context, which is the outer function scope or the element.
	 *
	 * https://drafts.csswg.org/css-mixins-1/#args
	 */
	private resolveBodyKeywords(value: string, declaredProp: string, scope: Scope, parameterArgs: Map<string, string>): string {
		const tokens = tokenize({ css: value });
		if (!tokens.some((token) => isTokenFunction(token) && token[4].value.toLowerCase() === 'var')) {
			// A bare CSS-wide keyword.
			const keyword = value.trim().toLowerCase();
			const replacement = CSS_WIDE_KEYWORDS.has(keyword) ? this.resolveLocalKeyword(keyword, declaredProp, scope, parameterArgs) : null;
			return replacement ? stringify([replacement]) : value;
		}

		const componentValues = parseListOfComponentValues(tokens);
		const changed = rewriteVarFallbackKeywords(componentValues, (keyword) => {
			return this.resolveLocalKeyword(keyword, declaredProp, scope, parameterArgs);
		});

		return changed ? stringify([componentValues]) : value;
	}

	/**
	 * Resolve a parameter's default value in the argument rule.
	 *
	 * Only the parameters are visible and CSS-wide keywords resolve against the
	 * parameter name.
	 */
	private rewriteDefault(defaultValue: string, parameterName: string, element: Rule, scope: Scope, parameterArgs: Map<string, string>, inlineDecls: Array<Declaration>, helpers: Helpers): string {
		const rewritten = this.rewriteValue(defaultValue, element, scope, inlineDecls, helpers);
		return this.resolveBodyKeywords(rewritten, parameterName, scope, parameterArgs);
	}

	private resolveLocalKeyword(keyword: string, declaredProp: string, scope: Scope, parameterArgs: Map<string, string>): Array<ComponentValue> | null {
		if (keyword === 'initial') {
			if (scope.registeredNames.has(declaredProp)) {
				return null;
			}

			return [this.varReference(parameterArgs.get(declaredProp) ?? INVALID_IDENT)];
		}

		if (keyword === 'inherit') {
			return [this.varReference(scope.parent?.get(declaredProp) ?? declaredProp)];
		}

		if (CSS_WIDE_KEYWORDS.has(keyword)) {
			// Any other CSS-wide keyword on a local variable resolves to the
			// guaranteed-invalid value.
			return [this.varReference(INVALID_IDENT)];
		}

		return null;
	}

	private rewriteValue(value: string, element: Rule, scope: Scope, inlineDecls: Array<Declaration>, helpers: Helpers): string {
		const tokens = tokenize({ css: value });
		if (!tokens.some((token) => isTokenFunction(token) && (token[4].value.toLowerCase() === 'var' || token[4].value.startsWith('--')))) {
			return value;
		}

		const componentValues = parseListOfComponentValues(tokens);

		replaceComponentValues([componentValues], (node) => {
			if (!isFunctionNode(node)) {
				return;
			}

			const name = node.getName();

			if (name.toLowerCase() === 'var') {
				this.rewriteVarReference(node, scope);
				return;
			}

			if (!name.startsWith('--')) {
				return;
			}

			const group = this.customFunctions.get(name);
			if (!group || !group.supported) {
				return;
			}

			return this.processCall(node, element, scope, inlineDecls, helpers);
		});

		return stringify([componentValues]);
	}

	private rewriteVarReference(node: FunctionNode, scope: Scope): void {
		for (const child of node.value) {
			if (isWhiteSpaceOrCommentNode(child)) {
				continue;
			}

			if (!isTokenNode(child) || !isTokenIdent(child.value)) {
				return;
			}

			const original = child.value[4].value;
			if (!original.startsWith('--')) {
				return;
			}

			const mapped = scope.get(original);
			if (!mapped) {
				return;
			}

			mutateIdent(child.value, mapped);
			return;
		}
	}

	private parseArguments(fn: FunctionNode): Array<Array<ComponentValue>> | false {
		const meaningful = fn.value.filter((componentValue) => !isWhiteSpaceOrCommentNode(componentValue));
		if (meaningful.length === 0) {
			return [];
		}

		const lists = parseCommaSeparatedListOfComponentValues(fn.value.flatMap((componentValue) => componentValue.tokens()));

		const args: Array<Array<ComponentValue>> = [];
		for (const list of lists) {
			const arg = unwrapArgument(list);
			if (!arg) {
				return false;
			}

			args.push(arg);
		}

		return args;
	}

	private invalidResultDeclaration(resultName: string, element: Rule, helpers: Helpers): Declaration {
		this.spendBudget();

		return helpers.decl({
			prop: resultName,
			value: `var(${INVALID_IDENT})`,
			source: element.source,
		});
	}

	private varReference(name: string): FunctionNode {
		return new CSSAFunctionNode(
			[TokenType.Function, 'var(', -1, -1, { value: 'var' }],
			[TokenType.CloseParen, ')', -1, -1, undefined],
			[
				new CSSATokenNode([TokenType.Ident, name, -1, -1, { value: name }]),
			],
		);
	}

	private argName(id: string, index: number): string {
		return this.names.argName(id, index);
	}

	private rawName(id: string, index: number): string {
		return this.names.rawName(id, index);
	}

	private localName(id: string, name: string): string {
		return this.names.localName(id, name);
	}

	private resultName(id: string): string {
		return this.names.resultName(id);
	}
}

function countNodes(node: ChildNode): number {
	let count = 1;

	if (node.type === 'rule' || node.type === 'atrule') {
		for (const child of node.nodes || []) {
			count += countNodes(child);
		}
	}

	return count;
}

/** Wrap registrations in clones of the conditional group rules around them. */
function wrapRegistrationsInConditionals(nodes: Array<AtRule>, conditionals: Array<AtRule>): Array<ChildNode> {
	let current: Array<ChildNode> = nodes;

	for (let i = conditionals.length - 1; i >= 0; i--) {
		current = [conditionals[i].clone({ nodes: current })];
	}

	return current;
}

/**
 * Wrap a list of nodes in the given conditional group rules.
 * The list is ordered outermost first.
 */
function wrapInConditionals(nodes: Array<ChildNode>, conditionals: Array<AtRule>): Array<ChildNode> {
	let current = nodes;

	for (let i = conditionals.length - 1; i >= 0; i--) {
		current = [conditionals[i].clone({ nodes: current })];
	}

	return current;
}

/**
 * Rewrite CSS-wide keywords that are the entire fallback of a `var()` function.
 *
 * Such a keyword becomes the value of the custom property being declared.
 */
function rewriteVarFallbackKeywords(componentValues: Array<ComponentValue>, resolve: (keyword: string) => Array<ComponentValue> | null): boolean {
	let changed = false;

	for (const componentValue of componentValues) {
		if (!isFunctionNode(componentValue) || componentValue.getName().toLowerCase() !== 'var') {
			continue;
		}

		const commaIndex = findTopLevelCommaIndex(componentValue.value);
		if (commaIndex === -1) {
			continue;
		}

		const fallback = componentValue.value.slice(commaIndex + 1);
		const meaningful = fallback.filter((x) => !isWhiteSpaceOrCommentNode(x));
		if (meaningful.length !== 1) {
			continue;
		}

		const target = meaningful[0];

		if (isTokenNode(target) && isTokenIdent(target.value)) {
			const replacement = resolve(target.value[4].value.toLowerCase());
			if (replacement) {
				componentValue.value = [...componentValue.value.slice(0, commaIndex + 1), ...replacement];
				changed = true;
			}

			continue;
		}

		if (isFunctionNode(target) && rewriteVarFallbackKeywords([target], resolve)) {
			changed = true;
		}
	}

	return changed;
}

function findTopLevelCommaIndex(componentValues: Array<ComponentValue>): number {
	for (let i = 0; i < componentValues.length; i++) {
		const componentValue = componentValues[i];
		if (isTokenNode(componentValue) && isTokenComma(componentValue.value)) {
			return i;
		}
	}

	return -1;
}

/**
 * Strip a `{}` wrapper from a single argument.
 *
 * https://drafts.csswg.org/css-values-5/#component-function-commas
 */
function unwrapArgument(list: Array<ComponentValue>): Array<ComponentValue> | false {
	const meaningful = list.filter((componentValue) => !isWhiteSpaceOrCommentNode(componentValue));
	if (meaningful.length === 0) {
		return false;
	}

	if (
		meaningful.length === 1 &&
		isSimpleBlockNode(meaningful[0]) &&
		isTokenOpenCurly(meaningful[0].startToken)
	) {
		return meaningful[0].value;
	}

	return list;
}

/**
 * Whether a function body contains any conditional group rule.
 *
 * Bodies with conditional rules can not be inlined into a single declaration
 * list, because those declarations must stay conditional.
 */
function hasConditionalBody(atRule: AtRule): boolean {
	let found = false;

	atRule.walkAtRules((child) => {
		if (IS_PROPERTY_REGEX.test(child.name)) {
			return;
		}

		if (child.nodes) {
			found = true;
		}
	});

	return found;
}

/** The unescaped name of a custom property token. */
function unescapedPropertyName(property: string): string | null {
	const token = tokenize({ css: property })[0];
	if (!token || !isTokenIdent(token)) {
		return null;
	}

	return token[4].value;
}

/**
 * Collect every local custom property declared anywhere in a function body.
 */
function collectLocalNames(atRule: AtRule): Set<string> {
	const names = new Set<string>();

	atRule.walkDecls((decl) => {
		const name = unescapedPropertyName(decl.prop);
		if (name !== null && name.startsWith('--')) {
			names.add(name);
		}
	});

	for (const name of collectRegisteredLocalNames(atRule)) {
		names.add(name);
	}

	return names;
}

/** Collect local variables that have an authored `@property` registration. */
function collectRegisteredLocalNames(atRule: AtRule): Set<string> {
	const names = new Set<string>();

	atRule.walkAtRules(IS_PROPERTY_REGEX, (propertyRule) => {
		for (const name of registeredPropertyNames(propertyRule)) {
			names.add(name);
		}
	});

	return names;
}

type CollectedPropertyRule = {
	propertyRule: AtRule,
	conditionals: Array<AtRule>,
};

/** Collect local `@property` rules together with the conditional rules around them. */
function collectPropertyRules(atRule: AtRule, conditionals: Array<AtRule> = [], out: Array<CollectedPropertyRule> = []): Array<CollectedPropertyRule> {
	for (const node of atRule.nodes || []) {
		if (node.type !== 'atrule') {
			continue;
		}

		if (IS_PROPERTY_REGEX.test(node.name)) {
			out.push({ propertyRule: node, conditionals });
			continue;
		}

		if (node.nodes) {
			collectPropertyRules(node, [...conditionals, node], out);
		}
	}

	return out;
}


