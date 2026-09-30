import type { AtRule, ChildNode, Declaration, Rule } from 'postcss';
import { AtRule as PostCSSAtRule, Declaration as PostCSSDeclaration } from 'postcss';
import crypto from 'node:crypto';
import path from 'node:path';
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
import { staticResultKeyword } from './static-result-keyword';

const GENERATED_PREFIX = '--_csstools-cf';
const INVALID_IDENT = `${GENERATED_PREFIX}-invalid`;
const CSS_WIDE_KEYWORDS = new Set(['initial', 'inherit', 'unset', 'revert', 'revert-layer', 'revert-rule']);

const sourceHashes = new Map<string, string>();

/**
 * A single lexical scope while evaluating a custom function.
 *
 * Maps the authored custom property names (`--x`) that are visible in this
 * scope to the generated, collision free names that are emitted into the CSS.
 */
class Scope {
	names: Map<string, string> = new Map();
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
	private registrations: Array<AtRule> = [];
	private sourceHash = '0';

	setCustomFunctions(customFunctions: Map<string, CustomFunctionGroup>): void {
		this.customFunctions = customFunctions;
	}

	/**
	 * `@property` registrations generated while transpiling.
	 * These are top level rules and must be appended to the root.
	 */
	getRegistrations(): Array<AtRule> {
		return this.registrations;
	}

	/**
	 * Replace all known custom function calls in a declaration value.
	 * Returns the new value, or `null` when nothing changed.
	 */
	processDeclaration(decl: Declaration): string | null {
		const tokens = tokenize({ css: decl.value });
		if (!tokens.some((token) => isTokenFunction(token) && token[4].value.startsWith('--'))) {
			return null;
		}

		const parent = decl.parent;
		if (!parent || parent.type !== 'rule') {
			return null;
		}

		this.sourceHash = sourceHashFor(decl.source?.input.from);

		const element = parent;
		const componentValues = parseListOfComponentValues(tokens);

		// Declarations that can be merged into the calling rule without changing
		// their cascade context.
		const inlineDecls: Array<Declaration> = [];

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

			return this.processCall(node, element, new Scope(null), inlineDecls);
		});

		const modified = stringify([componentValues]);
		if (modified === decl.value && !inlineDecls.length) {
			return null;
		}

		// Prepend the inlined declarations so they are available to the call.
		for (const inlineDecl of inlineDecls) {
			decl.cloneBefore(inlineDecl);
		}

		if (modified === decl.value) {
			return null;
		}

		return modified;
	}

	private processCall(fn: FunctionNode, element: Rule, parentScope: Scope, inlineDecls: Array<Declaration>): Array<ComponentValue> {
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
		const keywordResult = group.definitions.length === 1 ? staticResultKeyword(group.definitions[0].node) : null;

		// Arguments are resolved in the scope of the caller, before the function
		// itself is evaluated.
		const evaluatedArgs = args.map((arg) => {
			return this.rewriteValue(stringify([arg]), element, parentScope, inlineDecls);
		});

		const callId = (this.counter++).toString(36);
		const resultName = this.resultName(callId);

		const frame: CallFrame = { name, cyclic: false };
		this.frames.push(frame);

		for (const definition of group.definitions) {
			this.emitDefinition(definition, args, evaluatedArgs, element, parentScope, resultName, inlineDecls);
		}

		// Once a substitution context is marked as cyclic, the whole evaluation
		// returns the guaranteed-invalid value.
		if (frame.cyclic) {
			inlineDecls.push(this.invalidResultDeclaration(resultName, element));
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

	private emitDefinition(definition: CustomFunctionDefinition, args: Array<Array<ComponentValue>>, evaluatedArgs: Array<string>, element: Rule, parentScope: Scope, resultName: string, inlineDecls: Array<Declaration>): void {
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

		const nodes: Array<ChildNode> = [];

		if (!validArity) {
			inlineDecls.push(this.invalidResultDeclaration(resultName, element));
		} else {
			// Only inline when the definition can be evaluated exactly where it
			// is called: no conditional rule around it, no conditional rule in
			// the body, and no cascade layer to preserve.
			const inline = definition.conditionals.length === 0 && definition.layer >= 10_000_000 && !hasConditionalBody(definition.node);

			if (inline) {
				// Arguments are prepended to the calling rule, so no extra rule
				// is needed for them.
				this.emitArguments(definitionId, parameters, evaluatedArgs, element, parameterScope, parameterArgs, inlineDecls, inlineDecls);
			} else {
				const argDecls: Array<Declaration> = [];
				this.emitArguments(definitionId, parameters, evaluatedArgs, element, parameterScope, parameterArgs, argDecls, inlineDecls);

				if (argDecls.length) {
					nodes.push(...wrapInConditionals([element.clone({ nodes: argDecls })], definition.conditionals));
				}
			}

			for (let i = 0; i < parameters.length; i++) {
				const type = parameterType(parameters[i]);
				if (!type) {
					continue;
				}

				this.registrations.push(new PostCSSAtRule({
					name: 'property',
					params: this.argName(definitionId, i),
					nodes: [
						new PostCSSDeclaration({ prop: 'syntax', value: `"${type}"`, source: element.source }),
						new PostCSSDeclaration({ prop: 'inherits', value: 'false', source: element.source }),
						new PostCSSDeclaration({ prop: 'initial-value', value: parameters[i].getDefaultValue(), source: element.source }),
					],
					source: element.source,
				}));
			}

			if (inline) {
				this.emitBodyInline(definition.node.nodes || [], element, scope, parameterArgs, definitionId, resultName, inlineDecls);
			} else {
				nodes.push(...this.emitBody(definition.node.nodes || [], element, scope, parameterArgs, definitionId, resultName, definition.conditionals));
			}
		}

		if (!nodes.length) {
			return;
		}

		for (const node of nodes) {
			element.before(node);
		}
	}

	/**
	 * Emit the declarations that bind the arguments to the parameters.
	 */
	private emitArguments(definitionId: string, parameters: Array<FunctionParameter>, evaluatedArgs: Array<string>, element: Rule, parameterScope: Scope, parameterArgs: Map<string, string>, out: Array<Declaration>, inlineDecls: Array<Declaration>): void {
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
					out.push(new PostCSSDeclaration({
						prop: this.argName(definitionId, i),
						value: evaluatedArgs[i],
						source: element.source,
					}));
				} else if (defaultValue) {
					out.push(new PostCSSDeclaration({
						prop: this.argName(definitionId, i),
						value: this.rewriteDefault(defaultValue, parameter.getName(), element, parameterScope, parameterArgs, inlineDecls),
						source: element.source,
					}));
				}

				continue;
			}

			// Untyped parameters use a raw + fallback pair so that missing
			// and invalid arguments resolve to the default value.
			if (defaultValue) {
				if (hasArgument) {
					out.push(new PostCSSDeclaration({
						prop: this.rawName(definitionId, i),
						value: evaluatedArgs[i],
						source: element.source,
					}));
				}

				out.push(new PostCSSDeclaration({
					prop: this.argName(definitionId, i),
					value: `var(${this.rawName(definitionId, i)}, ${this.rewriteDefault(defaultValue, parameter.getName(), element, parameterScope, parameterArgs, inlineDecls)})`,
					source: element.source,
				}));

				continue;
			}

			if (hasArgument) {
				out.push(new PostCSSDeclaration({
					prop: this.argName(definitionId, i),
					value: evaluatedArgs[i],
					source: element.source,
				}));
			}
		}
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
				const processed = this.processBodyDeclaration(node, element, scope, parameterArgs, definitionId, resultName, pendingDecls);
				if (processed) {
					pendingDecls.push(processed);
				}

				continue;
			}

			if (node.type === 'atrule') {
				flush();

				out.push(...this.emitBody(node.nodes || [], element, scope, parameterArgs, definitionId, resultName, [...activeConditionals, node]));

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
	): void {
		for (const node of containerNodes) {
			if (node.type === 'decl') {
				const processed = this.processBodyDeclaration(node, element, scope, parameterArgs, definitionId, resultName, out);
				if (processed) {
					out.push(processed);
				}

				continue;
			}

			if (node.type === 'atrule') {
				this.emitBodyInline(node.nodes || [], element, scope, parameterArgs, definitionId, resultName, out);
			}
		}
	}

	private processBodyDeclaration(decl: Declaration, element: Rule, scope: Scope, parameterArgs: Map<string, string>, definitionId: string, resultName: string, inlineDecls: Array<Declaration>): Declaration | null {
		let prop: string;

		if (decl.prop.toLowerCase() === 'result') {
			prop = resultName;
		} else if (decl.prop.startsWith('--')) {
			const mapped = scope.get(decl.prop);
			if (!mapped) {
				return null;
			}

			prop = mapped;
		} else {
			// Unknown descriptors are invalid and ignored.
			return null;
		}

		// CSS-wide keywords on custom properties resolve against the property
		// being declared, including when they appear as a `var()` fallback.
		// This runs after the regular rewriting so that the inserted call-site
		// references are not rewritten to the local scope.
		let value = this.rewriteValue(decl.value, element, scope, inlineDecls);
		if (decl.prop.startsWith('--')) {
			value = this.resolveBodyKeywords(value, decl.prop, scope, parameterArgs);
		}

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
	private rewriteDefault(defaultValue: string, parameterName: string, element: Rule, scope: Scope, parameterArgs: Map<string, string>, inlineDecls: Array<Declaration>): string {
		const rewritten = this.rewriteValue(defaultValue, element, scope, inlineDecls);
		return this.resolveBodyKeywords(rewritten, parameterName, scope, parameterArgs);
	}

	private resolveLocalKeyword(keyword: string, declaredProp: string, scope: Scope, parameterArgs: Map<string, string>): Array<ComponentValue> | null {
		if (keyword === 'initial') {
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

	private rewriteValue(value: string, element: Rule, scope: Scope, inlineDecls: Array<Declaration>): string {
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

			return this.processCall(node, element, scope, inlineDecls);
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

	private invalidResultDeclaration(resultName: string, element: Rule): Declaration {
		return new PostCSSDeclaration({
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
		return `${GENERATED_PREFIX}-${this.sourceHash}-${id}-arg-${index}`;
	}

	private rawName(id: string, index: number): string {
		return `${GENERATED_PREFIX}-${this.sourceHash}-${id}-raw-${index}`;
	}

	private localName(id: string, name: string): string {
		return `${GENERATED_PREFIX}-${this.sourceHash}-${id}-local-${name.slice(2)}`;
	}

	private resultName(id: string): string {
		return `${GENERATED_PREFIX}-${this.sourceHash}-${id}-result`;
	}
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
		if (child.nodes) {
			found = true;
		}
	});

	return found;
}

/**
 * Collect every local custom property declared anywhere in a function body.
 */
function collectLocalNames(atRule: AtRule): Set<string> {
	const names = new Set<string>();

	atRule.walkDecls((decl) => {
		if (decl.prop.startsWith('--')) {
			names.add(decl.prop);
		}
	});

	return names;
}

/**
 * The type of a parameter, or `null` when it is untyped.
 * `type(*)` is the universal syntax and is treated as untyped.
 */
function parameterType(parameter: FunctionParameter): string | null {
	const type = parameter.getArgumentType();
	if (!type || type === '*') {
		return null;
	}

	return type;
}

/**
 * A short, stable hash of the source file, used to avoid collisions between
 * generated names from different stylesheets.
 *
 * This mirrors the naming approach of `postcss-private-rule`.
 */
function sourceHashFor(from: string | undefined): string {
	if (!from) {
		return '0';
	}

	const existing = sourceHashes.get(from);
	if (existing) {
		return existing;
	}

	const hash = crypto.createHash('md5');
	hash.update(path.basename(path.dirname(from)) + '/' + path.basename(from), 'utf8');
	const value = parseInt(hash.digest('hex'), 16).toString(36).slice(0, 8);
	sourceHashes.set(from, value);

	return value;
}
