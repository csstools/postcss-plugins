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
import { TokenType, isTokenFunction, isTokenIdent, isTokenOpenCurly, mutateIdent, tokenize } from '@csstools/css-tokenizer';
import type { CustomFunctionAndNode } from './custom-functions-from-root';
import type { FunctionParameter } from '@csstools/custom-function-parser';

const GENERATED_PREFIX = '--_csstools-cf';
const INVALID_IDENT = `${GENERATED_PREFIX}-invalid`;
const CSS_WIDE_KEYWORDS = new Set(['initial', 'inherit', 'unset', 'revert', 'revert-layer']);

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
 */
export class CustomFunctionTranspiler {
	private customFunctions: Map<string, CustomFunctionAndNode> = new Map();
	private counter = 0;
	private frames: Array<CallFrame> = [];
	private registrations: Array<AtRule> = [];
	private sourceHash = '0';

	setCustomFunctions(customFunctions: Map<string, CustomFunctionAndNode>): void {
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

		replaceComponentValues([componentValues], (node) => {
			if (!isFunctionNode(node)) {
				return;
			}

			const name = node.getName();
			if (!name.startsWith('--')) {
				return;
			}

			const entry = this.customFunctions.get(name);
			if (!entry || !entry.supported) {
				return;
			}

			return this.processCall(node, element, new Scope(null));
		});

		const modified = stringify([componentValues]);
		if (modified === decl.value) {
			return null;
		}

		return modified;
	}

	private processCall(fn: FunctionNode, element: Rule, parentScope: Scope): Array<ComponentValue> {
		const name = fn.getName();
		const entry = this.customFunctions.get(name);

		if (!entry || !entry.supported) {
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

		const parameters = entry.function.parameters;

		// More arguments than parameters is invalid.
		if (args.length > parameters.length) {
			return [this.varReference(INVALID_IDENT)];
		}

		// A parameter without a default value must be provided.
		for (let i = args.length; i < parameters.length; i++) {
			if (!parameters[i].getDefaultValue()) {
				return [this.varReference(INVALID_IDENT)];
			}
		}

		// CSS-wide keywords in `result` are left unresolved by the spec, so they
		// must be substituted directly instead of going through `var()`.
		//
		// This is only used when the function is not cyclic. A cycle anywhere in
		// the body makes the whole evaluation invalid.
		const keywordResult = staticResultKeyword(entry.node);

		// Arguments are resolved in the scope of the caller, before the function
		// itself is evaluated.
		const evaluatedArgs = args.map((arg) => {
			return this.rewriteValue(stringify([arg]), element, parentScope);
		});

		const id = (this.counter++).toString(36);
		const scope = new Scope(parentScope);
		const parameterArgs = new Map<string, string>();

		for (let i = 0; i < parameters.length; i++) {
			const argName = this.argName(id, i);
			scope.names.set(parameters[i].getName(), argName);
			parameterArgs.set(parameters[i].getName(), argName);
		}

		for (const localName of collectLocalNames(entry.node)) {
			scope.names.set(localName, this.localName(id, localName));
		}

		const frame: CallFrame = { name, cyclic: false };
		this.frames.push(frame);

		const argDecls: Array<Declaration> = [];
		for (let i = 0; i < parameters.length; i++) {
			if (i < evaluatedArgs.length) {
				argDecls.push(new PostCSSDeclaration({
					prop: this.argName(id, i),
					value: evaluatedArgs[i],
					source: element.source,
				}));

				continue;
			}

			// A missing argument resolves to the default value in the callee frame.
			const defaultValue = parameters[i].getDefaultValue();
			if (defaultValue) {
				argDecls.push(new PostCSSDeclaration({
					prop: this.argName(id, i),
					value: this.rewriteValue(defaultValue, element, scope),
					source: element.source,
				}));
			}
		}

		if (argDecls.length) {
			element.before(element.clone({ nodes: argDecls }));
		}

		for (let i = 0; i < parameters.length; i++) {
			const type = parameterType(parameters[i]);
			if (!type) {
				continue;
			}

			this.registrations.push(new PostCSSAtRule({
				name: 'property',
				params: this.argName(id, i),
				nodes: [
					new PostCSSDeclaration({ prop: 'syntax', value: `"${type}"`, source: element.source }),
					new PostCSSDeclaration({ prop: 'inherits', value: 'false', source: element.source }),
					new PostCSSDeclaration({ prop: 'initial-value', value: parameters[i].getDefaultValue(), source: element.source }),
				],
				source: element.source,
			}));
		}

		const bodyNodes = this.emitBody(entry.node.nodes || [], element, scope, parameterArgs, id);
		for (const node of bodyNodes) {
			element.before(node);
		}

		// Once a substitution context is marked as cyclic, the whole evaluation
		// returns the guaranteed-invalid value.
		if (frame.cyclic) {
			element.before(element.clone({
				nodes: [
					new PostCSSDeclaration({
						prop: this.resultName(id),
						value: `var(${INVALID_IDENT})`,
						source: element.source,
					}),
				],
			}));
		}

		this.frames.pop();

		if (frame.cyclic) {
			return [this.varReference(INVALID_IDENT)];
		}

		if (keywordResult) {
			return [new CSSATokenNode([TokenType.Ident, keywordResult, -1, -1, { value: keywordResult }])];
		}

		return [this.varReference(this.resultName(id))];
	}

	private emitBody(containerNodes: Array<ChildNode>, element: Rule, scope: Scope, parameterArgs: Map<string, string>, id: string): Array<ChildNode> {
		const out: Array<ChildNode> = [];
		let pendingDecls: Array<Declaration> = [];

		const flush = (): void => {
			if (!pendingDecls.length) {
				return;
			}

			out.push(element.clone({ nodes: pendingDecls }));
			pendingDecls = [];
		};

		for (const node of containerNodes) {
			if (node.type === 'decl') {
				const processed = this.processBodyDeclaration(node, element, scope, parameterArgs, id);
				if (processed) {
					pendingDecls.push(processed);
				}

				continue;
			}

			if (node.type === 'atrule') {
				flush();

				const children = this.emitBody(node.nodes || [], element, scope, parameterArgs, id);
				if (children.length) {
					out.push(node.clone({ nodes: children }));
				}

				continue;
			}
		}

		flush();

		return out;
	}

	private processBodyDeclaration(decl: Declaration, element: Rule, scope: Scope, parameterArgs: Map<string, string>, id: string): Declaration | null {
		let prop: string;

		if (decl.prop.toLowerCase() === 'result') {
			prop = this.resultName(id);
		} else if (decl.prop.startsWith('--')) {
			const mapped = scope.get(decl.prop);
			if (!mapped) {
				return null;
			}

			prop = mapped;

			const trimmedValue = decl.value.trim();

			// `initial` resolves to the parameter's own value (argument or default).
			const parameterArg = parameterArgs.get(decl.prop);
			if (parameterArg && trimmedValue.toLowerCase() === 'initial') {
				return decl.clone({
					prop,
					value: `var(${parameterArg})`,
				});
			}

			// `inherit` resolves to the custom property of the same name in the
			// calling context, which is the outer function scope or the element.
			if (trimmedValue.toLowerCase() === 'inherit') {
				const inherited = scope.parent?.get(decl.prop) ?? decl.prop;
				return decl.clone({
					prop,
					value: `var(${inherited})`,
				});
			}
		} else {
			// Unknown descriptors are invalid and ignored.
			return null;
		}

		return decl.clone({
			prop,
			value: this.rewriteValue(decl.value, element, scope),
		});
	}

	private rewriteValue(value: string, element: Rule, scope: Scope): string {
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

			const entry = this.customFunctions.get(name);
			if (!entry || !entry.supported) {
				return;
			}

			return this.processCall(node, element, scope);
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

	private localName(id: string, name: string): string {
		return `${GENERATED_PREFIX}-${this.sourceHash}-${id}-local-${name.slice(2)}`;
	}

	private resultName(id: string): string {
		return `${GENERATED_PREFIX}-${this.sourceHash}-${id}-result`;
	}
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

/**
 * When the winning `result` descriptor is a CSS-wide keyword and no conditional
 * rule can change it, the call evaluates to that keyword directly.
 */
function staticResultKeyword(atRule: AtRule): string | null {
	let conditionalResult = false;
	atRule.walkAtRules((child) => {
		child.walkDecls((decl) => {
			if (decl.prop.toLowerCase() === 'result') {
				conditionalResult = true;
			}
		});
	});

	if (conditionalResult) {
		return null;
	}

	let value: string | null = null;
	for (const node of atRule.nodes || []) {
		if (node.type === 'decl' && node.prop.toLowerCase() === 'result') {
			value = node.value.trim();
		}
	}

	if (!value) {
		return null;
	}

	if (CSS_WIDE_KEYWORDS.has(value.toLowerCase())) {
		return value;
	}

	return null;
}
