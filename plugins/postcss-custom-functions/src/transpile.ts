import type { AtRule, ChildNode, Declaration, Helpers, Rule } from 'postcss';
import type { ComponentValue, FunctionNode } from '@csstools/css-parser-algorithms';
import {
	FunctionNode as CSSAFunctionNode,
	TokenNode as CSSATokenNode,
	isFunctionNode,
	isSimpleBlockNode,
	isTokenNode,
	isWhiteSpaceOrCommentNode,
	parseListOfComponentValues,
	replaceComponentValues,
	stringify,
} from '@csstools/css-parser-algorithms';
import { TokenType, isTokenColon, isTokenComma, isTokenFunction, isTokenIdent, mutateIdent, tokenize } from '@csstools/css-tokenizer';
import type { TokenIdent } from '@csstools/css-tokenizer';
import type { CustomFunctionDefinition, CustomFunctionGroup } from './custom-functions-from-root';
import type { FunctionParameter } from '@csstools/custom-function-parser';
import type { CollectedPropertyRegistration } from '@csstools/utilities';
import { parameterType } from './classify';
import { GeneratedNames, INVALID_IDENT, sourceHashFor } from './generated-names';
import { CSS_WIDE_KEYWORDS } from './css-wide-keywords';
import { collectPropertyRegistrations, formatGeneratedNode, hoistPropertyRegistrations, parseDashedFunctionArguments, registeredPropertyNames, wrapInConditionals } from '@csstools/utilities';

// Custom functions can call each other and duplicate their bodies, which can
// grow exponentially. Bound the total number of declarations generated while
// transpiling so that a small stylesheet can not exhaust memory or CPU.
const MAX_GENERATED_DECLARATIONS = 100_000;
const IS_INHERIT_FUNCTION_REGEX = /^inherit$/i;
const IS_PROPERTY_REGEX = /^property$/i;
const IS_STYLE_FUNCTION_REGEX = /^style$/i;
const IS_VAR_FUNCTION_REGEX = /^var$/i;

const LAZY_FUNCTION_NAMES = new Set(['var', 'env', 'attr', 'inherit', 'if', 'first-valid']);

type ArgumentValue = {
	value: string,
	cssWideKeyword: string | null,
};

/**
 * A single lexical scope while evaluating a custom function.
 *
 * Maps the authored custom property names (`--x`) that are visible in this
 * scope to the generated, collision free names that are emitted into the CSS.
 */
class Scope {
	names: Map<string, string> = new Map();
	fallbacks: Map<string, string> = new Map();
	registeredNames: Set<string> = new Set();
	unconditionalRegisteredNames: Set<string> = new Set();
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

	getFallback(name: string): string | undefined {
		if (this.names.has(name)) {
			return this.fallbacks.get(name);
		}

		return this.parent?.getFallback(name);
	}
}

type CycleContext = {
	conditionals: Array<AtRule>,
	isResult: boolean,
	lazy: boolean,
};

type CallFrame = {
	name: string,
	cyclic: boolean,
	hasKeywordResult: boolean,
	live: boolean,
	lazy: boolean,
	cycles: Array<CycleContext>,
};

export type ProcessDeclarationResult = {
	value: string | null,
	emittedNodes: Array<ChildNode>,
	inlineDecls: Array<Declaration>,
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
	private currentConditionals: Array<AtRule> = [];
	private currentIsResult = false;
	private currentLazy = false;

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

	/** Replace all known custom function calls in a declaration value. */
	processDeclaration(decl: Declaration, helpers: Helpers): ProcessDeclarationResult {
		const tokens = tokenize({ css: decl.value });
		if (!tokens.some((token) => isTokenFunction(token) && token[4].value.startsWith('--'))) {
			return { value: null, emittedNodes: [], inlineDecls: [] };
		}

		const parent = decl.parent;
		if (!parent || parent.type !== 'rule') {
			return { value: null, emittedNodes: [], inlineDecls: [] };
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
		this.currentConditionals = [];
		this.currentIsResult = false;
		this.currentLazy = false;

		const lazyComponentValues = collectLazyComponentValues(componentValues, false);

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

			return this.processCall(node, element, new Scope(null), inlineDecls, helpers, new Map(), lazyComponentValues.has(node));
		});

		const modified = stringify([componentValues]);
		const emittedNodes = this.emittedNodes;
		this.emittedNodes = [];

		return {
			value: modified === decl.value ? null : modified,
			emittedNodes,
			inlineDecls,
		};
	}

	private processCall(fn: FunctionNode, element: Rule, parentScope: Scope, inlineDecls: Array<Declaration>, helpers: Helpers, parameterArgs: Map<string, string>, lazy: boolean): Array<ComponentValue> {
		const name = fn.getName();
		const group = this.customFunctions.get(name);

		if (!group || !group.supported) {
			return [this.varReference(INVALID_IDENT)];
		}

		// A function that (indirectly) calls itself is cyclic and evaluates to
		// the guaranteed-invalid value.
		const existingFrame = this.frames.find((frame) => frame.name === name);
		if (existingFrame) {
			const cycleLazy = existingFrame.lazy || lazy;
			const cycleConditionals = this.currentConditionals;
			const invalidating = existingFrame.live &&
				!cycleLazy &&
				!this.currentIsResult &&
				(cycleConditionals.length === 0 || existingFrame.hasKeywordResult);

			existingFrame.cyclic = existingFrame.cyclic || invalidating;
			existingFrame.cycles.push({
				conditionals: cycleConditionals,
				isResult: this.currentIsResult,
				lazy: cycleLazy,
			});
			return [this.varReference(INVALID_IDENT)];
		}

		const args = parseDashedFunctionArguments(fn);
		if (!args) {
			return [this.varReference(INVALID_IDENT)];
		}

		// CSS-wide keywords in `result` are left unresolved by the spec, so they
		// must be substituted directly instead of going through `var()`.
		//
		// This is only used when the function is not cyclic. A cycle anywhere in
		// the body makes the whole evaluation invalid.
		const keywordResult = group.definitions.length === 1 ? group.definitions[0].keywordResult : null;

		const savedConditionals = this.currentConditionals;
		const savedIsResult = this.currentIsResult;
		const savedLazy = this.currentLazy;
		this.currentLazy = lazy;

		// Arguments are resolved in the scope of the caller, before the function
		// itself is evaluated.
		const evaluatedArgs = args.map((arg) => {
			return this.rewriteValue(stringify([arg]), element, parentScope, inlineDecls, helpers, parameterArgs);
		});

		const callId = (this.counter++).toString(36);
		const resultName = this.resultName(callId);

		const frame: CallFrame = { name, cyclic: false, hasKeywordResult: !!keywordResult, live: false, lazy, cycles: [] };
		this.frames.push(frame);

		const firstLive = firstLiveDefinition(group.definitions);
		let lastNonInline = -1;
		for (let i = 0; i < group.definitions.length; i++) {
			if (!canInlineDefinition(group.definitions[i])) {
				lastNonInline = i;
			}
		}

		for (let i = 0; i < group.definitions.length; i++) {
			const live = i >= firstLive;
			const inline = live && i > lastNonInline;
			const cycleStart = frame.cycles.length;

			frame.live = live;
			this.emitDefinition(group.definitions[i], args, evaluatedArgs, element, parentScope, resultName, inlineDecls, helpers, inline);
			if (live) {
				this.emitCycleInvalidResults(frame, cycleStart, element, resultName, inlineDecls, helpers, inline);
			}
		}

		this.frames.pop();

		this.currentConditionals = savedConditionals;
		this.currentIsResult = savedIsResult;
		this.currentLazy = savedLazy;

		if (frame.cyclic) {
			return [this.varReference(INVALID_IDENT)];
		}

		if (keywordResult) {
			return [new CSSATokenNode([TokenType.Ident, keywordResult, -1, -1, { value: keywordResult }])];
		}

		return [this.varReference(resultName)];
	}

	private emitDefinition(definition: CustomFunctionDefinition, args: Array<Array<ComponentValue>>, evaluatedArgs: Array<string>, element: Rule, parentScope: Scope, resultName: string, inlineDecls: Array<Declaration>, helpers: Helpers, inline: boolean): void {
		const parameters = definition.function.parameters;

		this.currentConditionals = definition.conditionals;
		this.currentIsResult = false;

		// More arguments than parameters is invalid.
		// A parameter without a default value must be provided.
		let validArity = args.length <= parameters.length;
		if (validArity) {
			for (let i = args.length; i < parameters.length; i++) {
				if (parameters[i].colon === null) {
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

		const declaredLocalNames = collectDeclaredLocalNames(definition.node);
		for (const localName of declaredLocalNames.all) {
			scope.names.set(localName, this.localName(definitionId, localName));
		}

		const propertyRegistrations = collectPropertyRegistrations(definition.node, {
			isConditional: () => true,
			shouldDescend: (atRule) => !!atRule.nodes,
		});

		const conditionalRegistrationNames = new Set<string>();
		for (const { atRule, conditionals } of propertyRegistrations) {
			if (!conditionals.length) {
				continue;
			}

			for (const name of registeredPropertyNames(atRule)) {
				conditionalRegistrationNames.add(name);
			}
		}

		const registrationNames = new Map<string, string>();
		for (const { atRule } of propertyRegistrations) {
			for (const registeredName of registeredPropertyNames(atRule)) {
				scope.registeredNames.add(registeredName);

				// A registration for a name that is already a parameter registers
				// that parameter. It only becomes a separate local variable when
				// the function body also declares it.
				const target = scope.names.get(registeredName) ?? this.localName(definitionId, registeredName);
				if (!scope.names.has(registeredName)) {
					scope.names.set(registeredName, target);
				}

				registrationNames.set(registeredName, target);
			}
		}

		for (const { atRule, conditionals } of propertyRegistrations) {
			if (conditionals.length) {
				continue;
			}

			for (const name of registeredPropertyNames(atRule)) {
				scope.unconditionalRegisteredNames.add(name);
			}
		}

		for (const name of conditionalRegistrationNames) {
			const parameterName = parameterArgs.get(name);
			if (!parameterName || !declaredLocalNames.all.has(name)) {
				continue;
			}

			// A conditional local registration can be inactive while the local
			// declaration is still read. Fall back to the parameter value.
			scope.fallbacks.set(name, parameterName);
		}

		const baseDecls: Array<Declaration> = [];
		const baseNames = new Set(declaredLocalNames.conditional);
		for (const name of declaredLocalNames.unconditional) {
			baseNames.delete(name);
		}

		for (const name of baseNames) {
			const prop = scope.names.get(name);
			if (!prop) {
				continue;
			}

			const fallback = parameterArgs.get(name) ?? scope.parent?.get(name) ?? name;
			baseDecls.push(helpers.decl({ prop, value: `var(${fallback})`, source: element.source }));
		}

		const resolvedArgs: Array<ArgumentValue> = validArity
			? evaluatedArgs.map((value, i) => this.resolveArgumentKeywords(value, parameters[i].getName(), parentScope))
			: evaluatedArgs.map((value) => ({ value, cssWideKeyword: null }));

		const cssWideKeywordArgs = new Set<number>();
		for (let i = 0; i < resolvedArgs.length; i++) {
			if (resolvedArgs[i].cssWideKeyword !== null) {
				cssWideKeywordArgs.add(i);
			}
		}

		const nodes: Array<ChildNode> = [];
		const typedParameters = new Map<string, string>();

		if (!validArity) {
			inlineDecls.push(this.invalidResultDeclaration(resultName, element, helpers));
		} else {
			if (inline) {
				// Arguments are prepended to the calling rule, so no extra rule
				// is needed for them.
				this.emitArguments(definitionId, parameters, resolvedArgs, element, parameterScope, parameterArgs, inlineDecls, inlineDecls, helpers);
			} else {
				const argDecls: Array<Declaration> = [];
				this.emitArguments(definitionId, parameters, resolvedArgs, element, parameterScope, parameterArgs, argDecls, inlineDecls, helpers);

				if (argDecls.length) {
					nodes.push(...wrapInConditionals([element.clone({ nodes: argDecls })], definition.conditionals));
				}
			}

			if (baseDecls.length) {
				nodes.push(...wrapInConditionals([element.clone({ nodes: baseDecls })], definition.conditionals));
			}

			for (let i = 0; i < parameters.length; i++) {
				const type = parameterType(parameters[i]);
				if (!type) {
					continue;
				}

				typedParameters.set(parameters[i].getName(), type);

				this.spendBudget();

				this.pushRegistration(helpers.atRule({
					name: 'property',
					params: this.argName(definitionId, i),
					nodes: [
						helpers.decl({ prop: 'syntax', value: `"${type}"`, source: element.source }),
						helpers.decl({ prop: 'inherits', value: 'true', source: element.source }),
						...(cssWideKeywordArgs.has(i) ? [] : [helpers.decl({ prop: 'initial-value', value: parameters[i].getDefaultValue(), source: element.source })]),
					],
					source: element.source,
				}), definition.conditionals);
			}

			for (const localName of declaredLocalNames.all) {
				const type = typedParameters.get(localName);
				const prop = scope.names.get(localName);
				if (!type || !prop || registrationNames.has(localName)) {
					continue;
				}

				this.spendBudget();

				this.pushRegistration(helpers.atRule({
					name: 'property',
					params: prop,
					nodes: [
						helpers.decl({ prop: 'syntax', value: `"${type}"`, source: element.source }),
						helpers.decl({ prop: 'inherits', value: 'true', source: element.source }),
					],
					source: element.source,
				}), definition.conditionals);
			}

			this.emitLocalRegistrations(propertyRegistrations, definition.conditionals, definitionId, registrationNames);

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

	/**
	 * Invalidate the result for cycles in code that is always evaluated.
	 *
	 * Cycles in `result` declarations are already replaced in place and are
	 * resolved by the cascade, so only cycles in locals need a trailing
	 * invalidation. The invalidation is scoped to the conditional rules that
	 * guard the cyclic declaration, because an inactive declaration is never
	 * evaluated. It is emitted per definition so that a stronger definition
	 * can still win.
	 */
	private emitCycleInvalidResults(frame: CallFrame, fromIndex: number, element: Rule, resultName: string, inlineDecls: Array<Declaration>, helpers: Helpers, inline: boolean): void {
		const cycles = frame.cycles.slice(fromIndex).filter((cycle) => !cycle.isResult && !cycle.lazy);
		if (!cycles.length) {
			return;
		}

		if (inline) {
			inlineDecls.push(this.invalidResultDeclaration(resultName, element, helpers));
			return;
		}

		if (cycles.some((cycle) => !cycle.conditionals.length)) {
			this.emittedNodes.push(...wrapInConditionals([element.clone({ nodes: [this.invalidResultDeclaration(resultName, element, helpers)] })], []));
			return;
		}

		const seen = new Set<string>();
		for (const cycle of cycles) {
			const key = conditionalsKey(cycle.conditionals);
			if (seen.has(key)) {
				continue;
			}

			seen.add(key);
			this.emittedNodes.push(...wrapInConditionals([element.clone({ nodes: [this.invalidResultDeclaration(resultName, element, helpers)] })], cycle.conditionals));
		}
	}

	/** Moves local `@property` rules to the root with their generated local names. */
	private emitLocalRegistrations(propertyRegistrations: Array<CollectedPropertyRegistration>, ancestorConditionals: Array<AtRule>, definitionId: string, registrationNames: Map<string, string>): void {
		const { registrations } = hoistPropertyRegistrations(propertyRegistrations, {
			rewrite: (name) => registrationNames.get(name) ?? this.localName(definitionId, name),
			conditionals: ancestorConditionals,
		});

		for (const registration of registrations) {
			this.spendBudget(countNodes(registration));
		}

		this.registrations.push(...registrations);
	}

	private pushRegistration(registration: AtRule, conditionals: Array<AtRule>): void {
		const registrations = wrapInConditionals([registration], conditionals);
		for (const node of registrations) {
			formatGeneratedNode(node, '\n\n', '');
		}

		this.registrations.push(...registrations);
	}

	/**
	 * Emit the declarations that bind the arguments to the parameters.
	 */
	private emitArguments(definitionId: string, parameters: Array<FunctionParameter>, evaluatedArgs: Array<ArgumentValue>, element: Rule, parameterScope: Scope, parameterArgs: Map<string, string>, out: Array<Declaration>, inlineDecls: Array<Declaration>, helpers: Helpers): void {
		const outStart = out.length;

		for (let i = 0; i < parameters.length; i++) {
			const parameter = parameters[i];
			const type = parameterType(parameter);
			const defaultValue = parameter.getDefaultValue();
			// An empty default value (`--x:`) is distinct from no default value.
			const hasDefault = parameter.colon !== null;
			const argument = evaluatedArgs[i];
			const hasArgument = argument !== undefined;

			// CSS-wide keywords in an argument do not fall back to the default.
			if (hasArgument && argument.cssWideKeyword !== null) {
				out.push(helpers.decl({
					prop: this.argName(definitionId, i),
					value: argument.value,
					source: element.source,
				}));

				continue;
			}

			if (type) {
				// Typed parameters use a generated `@property` registration.
				// The registration provides the default value for missing
				// arguments and for arguments that fail the type check.
				if (hasArgument) {
					out.push(helpers.decl({
						prop: this.argName(definitionId, i),
						value: argument.value,
						source: element.source,
					}));
				} else if (hasDefault) {
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
			if (hasDefault) {
				if (hasArgument) {
					out.push(helpers.decl({
						prop: this.rawName(definitionId, i),
						value: argument.value,
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
					value: argument.value,
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
				this.currentConditionals = activeConditionals;
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
		this.currentConditionals = [];

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
		// `!important` is not allowed in `@function` bodies.
		if (decl.important) {
			return null;
		}

		let prop: string;
		let declaredProp: string | null = null;

		const isResult = decl.prop.toLowerCase() === 'result';
		if (isResult) {
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
		const previousIsResult = this.currentIsResult;
		this.currentIsResult = isResult;

		let value = this.rewriteValue(decl.value, element, scope, inlineDecls, helpers, parameterArgs);

		this.currentIsResult = previousIsResult;
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
	 * Resolve CSS-wide keywords in a provided argument value.
	 *
	 * In the argument rule `initial` resolves to the guaranteed-invalid value,
	 * `inherit` to the same-named custom property in the calling context and
	 * all other CSS-wide keywords to the guaranteed-invalid value.
	 *
	 * https://drafts.csswg.org/css-mixins-1/#arg-cascade
	 */
	private resolveArgumentKeywords(value: string, parameterName: string, callerScope: Scope): ArgumentValue {
		const componentValues = parseListOfComponentValues(tokenize({ css: value }));
		let keyword: string | null = null;
		let meaningfulCount = 0;
		let hasVar = false;

		for (const componentValue of componentValues) {
			if (isWhiteSpaceOrCommentNode(componentValue)) {
				continue;
			}

			meaningfulCount++;

			if (isFunctionNode(componentValue)) {
				if (componentValue.getName().toLowerCase() === 'var') {
					hasVar = true;
				}

				continue;
			}

			if (isTokenNode(componentValue) && isTokenIdent(componentValue.value)) {
				keyword = componentValue.value[4].value.toLowerCase();
			}
		}

		if (!hasVar) {
			if (meaningfulCount === 1 && keyword !== null && CSS_WIDE_KEYWORDS.has(keyword)) {
				const replacement = this.resolveArgumentKeyword(keyword, parameterName, callerScope);
				return {
					value: replacement ? stringify([replacement]) : value,
					cssWideKeyword: keyword,
				};
			}

			return { value, cssWideKeyword: null };
		}

		let keywordFallback: string | null = null;
		const changed = rewriteVarFallbackKeywords(componentValues, (fallbackKeyword) => {
			if (keywordFallback === null) {
				keywordFallback = fallbackKeyword;
			}

			return this.resolveArgumentKeyword(fallbackKeyword, parameterName, callerScope);
		});

		return { value: changed ? stringify([componentValues]) : value, cssWideKeyword: keywordFallback };
	}

	private resolveArgumentKeyword(keyword: string, parameterName: string, callerScope: Scope): Array<ComponentValue> | null {
		if (keyword === 'inherit') {
			return [this.varReference(callerScope.get(parameterName) ?? parameterName)];
		}

		if (CSS_WIDE_KEYWORDS.has(keyword)) {
			return [this.varReference(INVALID_IDENT)];
		}

		return null;
	}

	/**
	 * Resolve a parameter's default value in the argument rule.
	 *
	 * Only the parameters are visible and CSS-wide keywords resolve against the
	 * parameter name.
	 */
	private rewriteDefault(defaultValue: string, parameterName: string, element: Rule, scope: Scope, parameterArgs: Map<string, string>, inlineDecls: Array<Declaration>, helpers: Helpers): string {
		const rewritten = this.rewriteValue(defaultValue, element, scope, inlineDecls, helpers, parameterArgs);
		return this.resolveBodyKeywords(rewritten, parameterName, scope, parameterArgs);
	}

	private resolveLocalKeyword(keyword: string, declaredProp: string, scope: Scope, parameterArgs: Map<string, string>): Array<ComponentValue> | null {
		if (keyword === 'initial') {
			if (scope.unconditionalRegisteredNames.has(declaredProp)) {
				return null;
			}

			if (scope.registeredNames.has(declaredProp) && !parameterArgs.has(declaredProp)) {
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

	private rewriteValue(value: string, element: Rule, scope: Scope, inlineDecls: Array<Declaration>, helpers: Helpers, parameterArgs: Map<string, string>): string {
		const tokens = tokenize({ css: value });
		if (!tokens.some((token) => {
			if (!isTokenFunction(token)) {
				return false;
			}

			const name = token[4].value.toLowerCase();
			return name === 'var' || name === 'if' || name === 'style' || name === 'inherit' || token[4].value.startsWith('--');
		})) {
			return value;
		}

		const componentValues = parseListOfComponentValues(tokens);
		const lazyComponentValues = collectLazyComponentValues(componentValues, this.currentLazy);

		replaceComponentValues([componentValues], (node) => {
			if (!isFunctionNode(node)) {
				return;
			}

			const name = node.getName();

			if (IS_VAR_FUNCTION_REGEX.test(name)) {
				this.rewriteVarReference(node, scope);
				return;
			}

			if (IS_STYLE_FUNCTION_REGEX.test(name)) {
				this.rewriteStyleFunction(node, scope, parameterArgs);
				return;
			}

			if (IS_INHERIT_FUNCTION_REGEX.test(name)) {
				this.rewriteInheritFunction(node, scope);
				return;
			}

			if (!name.startsWith('--')) {
				return;
			}

			const group = this.customFunctions.get(name);
			if (!group || !group.supported) {
				return;
			}

			return this.processCall(node, element, scope, inlineDecls, helpers, parameterArgs, lazyComponentValues.has(node));
		});

		return stringify([componentValues]);
	}

	private rewriteStyleFunction(node: FunctionNode, scope: Scope, parameterArgs: Map<string, string>): void {
		let nameIndex = -1;
		let authoredName = '';
		let nameToken: TokenIdent | null = null;

		for (let i = 0; i < node.value.length; i++) {
			const child = node.value[i];
			if (isWhiteSpaceOrCommentNode(child)) {
				continue;
			}

			if (!isTokenNode(child) || !isTokenIdent(child.value)) {
				return;
			}

			authoredName = child.value[4].value;
			if (!authoredName.startsWith('--')) {
				return;
			}

			nameIndex = i;
			nameToken = child.value;
			break;
		}

		if (nameIndex === -1 || !nameToken) {
			return;
		}

		const mapped = scope.get(authoredName);
		if (!mapped) {
			return;
		}

		mutateIdent(nameToken, mapped);

		let colonIndex = -1;
		for (let i = nameIndex + 1; i < node.value.length; i++) {
			const child = node.value[i];
			if (isTokenNode(child) && isTokenColon(child.value)) {
				colonIndex = i;
				break;
			}
		}

		if (colonIndex === -1) {
			return;
		}

		const meaningful = node.value.slice(colonIndex + 1).filter((child) => !isWhiteSpaceOrCommentNode(child));
		if (meaningful.length !== 1) {
			return;
		}

		const keywordNode = meaningful[0];
		if (!isTokenNode(keywordNode) || !isTokenIdent(keywordNode.value)) {
			return;
		}

		const keyword = keywordNode.value[4].value.toLowerCase();
		if (!CSS_WIDE_KEYWORDS.has(keyword)) {
			return;
		}

		const replacement = this.resolveLocalKeyword(keyword, authoredName, scope, parameterArgs);
		if (!replacement) {
			return;
		}

		node.value = [...node.value.slice(0, colonIndex + 1), ...replacement];
	}

	/**
	 * Rewrite `inherit(--x)` to a `var()` reference of the caller's frame.
	 *
	 * Inside a function body `inherit()` refers to the value the property would
	 * have in the calling context, not to the value on the parent element.
	 *
	 * https://drafts.csswg.org/css-values-5/#inherit-notation
	 */
	private rewriteInheritFunction(node: FunctionNode, scope: Scope): void {
		for (let i = 0; i < node.value.length; i++) {
			const child = node.value[i];
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

			mutateIdent(child.value, scope.parent?.get(original) ?? original);
			node.name[1] = 'var(';
			node.name[4].value = 'var';
			return;
		}
	}

	private rewriteVarReference(node: FunctionNode, scope: Scope): void {
		for (let i = 0; i < node.value.length; i++) {
			const child = node.value[i];
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

			const fallback = scope.getFallback(original);
			if (!fallback) {
				mutateIdent(child.value, mapped);
				return;
			}

			const commaIndex = findTopLevelCommaIndex(node.value);
			const fallbackReference = this.varReference(fallback);

			if (commaIndex === -1) {
				node.value = [
					...node.value.slice(0, i + 1),
					new CSSATokenNode([TokenType.Comma, ',', -1, -1, undefined]),
					fallbackReference,
				];
			} else {
				fallbackReference.value = [
					...fallbackReference.value,
					node.value[commaIndex],
					...node.value.slice(commaIndex + 1),
				];
				node.value = [
					...node.value.slice(0, commaIndex + 1),
					fallbackReference,
				];
			}

			mutateIdent(child.value, mapped);
			return;
		}
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

/**
 * Whether a definition can be evaluated in the calling rule without a guard.
 */
function canInlineDefinition(definition: CustomFunctionDefinition): boolean {
	return definition.conditionals.length === 0 && definition.layer === false && !hasConditionalBody(definition.node);
}

/**
 * The first definition that can win the cascade. Earlier definitions are
 * always beaten by a later unconditional definition with an unconditional
 * result.
 */
function firstLiveDefinition(definitions: Array<CustomFunctionDefinition>): number {
	let lastDominating = 0;

	for (let i = 0; i < definitions.length; i++) {
		if (definitions[i].conditionals.length === 0 && hasUnconditionalResult(definitions[i])) {
			lastDominating = i;
		}
	}

	return lastDominating;
}

function hasUnconditionalResult(definition: CustomFunctionDefinition): boolean {
	return (definition.node.nodes || []).some((node) => {
		return node.type === 'decl' && !node.important && node.prop.toLowerCase() === 'result';
	});
}

/**
 * Component values that are only evaluated when selected: fallbacks and
 * conditional branches.
 */
function collectLazyComponentValues(componentValues: Array<ComponentValue>, inheritedLazy: boolean): WeakSet<ComponentValue> {
	const lazyComponentValues = new WeakSet<ComponentValue>();

	collectLazyComponentValuesFrom(componentValues, inheritedLazy, lazyComponentValues);

	return lazyComponentValues;
}

function collectLazyComponentValuesFrom(componentValues: Array<ComponentValue>, inheritedLazy: boolean, out: WeakSet<ComponentValue>): void {
	for (const componentValue of componentValues) {
		if (isFunctionNode(componentValue)) {
			const lazy = inheritedLazy || LAZY_FUNCTION_NAMES.has(componentValue.getName().toLowerCase());
			if (lazy) {
				out.add(componentValue);
			}

			collectLazyComponentValuesFrom(componentValue.value, lazy, out);
			continue;
		}

		if (isSimpleBlockNode(componentValue)) {
			collectLazyComponentValuesFrom(componentValue.value, inheritedLazy, out);
		}
	}
}

function conditionalsKey(conditionals: Array<AtRule>): string {
	return conditionals.map((conditional) => `${conditional.name}\u0000${conditional.params}`).join('\u0001');
}

/** The unescaped name of a custom property token. */
function unescapedPropertyName(property: string): string | null {
	const token = tokenize({ css: property })[0];
	if (!token || !isTokenIdent(token)) {
		return null;
	}

	return token[4].value;
}

type DeclaredLocalNames = {
	all: Set<string>,
	conditional: Set<string>,
	unconditional: Set<string>,
};

/** Collect every local custom property declared anywhere in a function body. */
function collectDeclaredLocalNames(atRule: AtRule): DeclaredLocalNames {
	const names: DeclaredLocalNames = {
		all: new Set<string>(),
		conditional: new Set<string>(),
		unconditional: new Set<string>(),
	};

	collectDeclaredLocalNamesFrom(atRule.nodes || [], false, names);

	return names;
}

function collectDeclaredLocalNamesFrom(nodes: Array<ChildNode>, inConditional: boolean, names: DeclaredLocalNames): void {
	for (const node of nodes) {
		if (node.type === 'decl') {
			if (node.important) {
				continue;
			}

			const name = unescapedPropertyName(node.prop);
			if (name === null || !name.startsWith('--')) {
				continue;
			}

			names.all.add(name);
			(inConditional ? names.conditional : names.unconditional).add(name);
			continue;
		}

		if (node.type === 'atrule' && node.nodes && !IS_PROPERTY_REGEX.test(node.name)) {
			collectDeclaredLocalNamesFrom(node.nodes, true, names);
		}
	}
}


