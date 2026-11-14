import type { AtRule, ChildNode, Helpers, Root, Rule } from 'postcss';
import { createPrivatePropertyTranspiler } from '@csstools/utilities-for-private-properties';
import { IS_APPLY_REGEX, processableApplyRule } from './processable-apply';
import type { MixinParameter } from './processable-mixin';
import { processableMixinRule } from './processable-mixin';

type Mixin = {
	name: string,
	parameters: Array<MixinParameter>,
	atRule: AtRule,
};

const IS_CONTENTS_REGEX = /^contents$/i;
const IS_PRIVATE_REGEX = /^private$/i;
const IS_LAYER_REGEX = /^layer$/i;

// Mixins can reference each other and duplicate subtrees, which can grow
// exponentially. Bound the total number of nodes generated while expanding
// mixins so that a small stylesheet can not exhaust memory or CPU.
const MAX_GENERATED_NODES = 100_000;

/**
 * Deepens mixin expansion behind a small interface:
 * register the mixins once, expand the top level `@apply` rules, then finish.
 *
 * Everything else — argument capture, wrapper construction, private scoping,
 * `@contents` substitution, nested recursion and the cycle guard — is internal.
 */
export class MixinExpander {
	private mixins: Map<string, Mixin> = new Map();
	private knownMixins: Set<string> = new Set();
	private privateTranspiler = createPrivatePropertyTranspiler({ namespace: 'm' });
	private registrations: Array<AtRule> = [];
	private argumentCounter = 0;
	private desugaredNestingRules: Set<Rule> = new Set();
	private expanding: Set<string> = new Set();
	private generatedNodes = 0;

	/** The mixin at rules that were registered, so a caller can remove or preserve them. */
	registeredMixins(): Array<Mixin> {
		return Array.from(this.mixins.values());
	}

	registerMixins(rootAtRules: Array<AtRule>): void {
		for (const atRule of rootAtRules) {
			const parsed = processableMixinRule(atRule);
			if (!parsed) {
				continue;
			}

			// TODO: support mixin overrides
			if (this.knownMixins.has(parsed.name)) {
				this.mixins.delete(parsed.name);
				continue;
			}

			this.mixins.set(parsed.name, Object.assign({}, parsed, { atRule }));
			this.knownMixins.add(parsed.name);
		}
	}

	/** Expands all top level `@apply` rules in `root`, except those authored inside a `@mixin`. */
	expandAll(root: Root, preserve: boolean, helpers: Helpers): void {
		this.generatedNodes = 0;

		const applies: Array<AtRule> = [];
		root.walkAtRules(IS_APPLY_REGEX, (atRule) => {
			if (hasMixinAncestor(atRule)) {
				return;
			}

			applies.push(atRule);
		});

		for (const atRule of applies) {
			if (!atRule.parent) {
				continue;
			}

			this.expand(atRule, preserve, helpers);
		}
	}

	/** Removes temporary wrappers and appends registrations to the root. */
	finish(root: Root): void {
		for (const wrapper of this.desugaredNestingRules) {
			wrapper.replaceWith(...wrapper.nodes || []);
		}

		this.desugaredNestingRules.clear();

		root.append(...this.registrations);
		this.registrations = [];
	}

	private expand(atRule: AtRule, preserve: boolean, helpers: Helpers): void {
		const apply = processableApplyRule(atRule);
		if (!apply) {
			return;
		}

		const mixin = this.mixins.get(apply.name);
		if (!mixin) {
			return;
		}

		// Guard against mixins that (indirectly) apply themselves.
		if (this.expanding.has(apply.name)) {
			return;
		}

		// Passing more arguments than the mixin accepts is invalid.
		if (apply.arguments.length > mixin.parameters.length) {
			return;
		}

		this.expanding.add(apply.name);

		const inserted = this.buildBody(atRule, apply.arguments, mixin, helpers);

		this.spendBudget(countNodes(inserted));

		// Insert as a batch: PostCSS resolves the index of `atRule` with
		// `indexOf` for every single `before()` call, which is quadratic.
		atRule.before(inserted);

		if (!preserve) {
			atRule.remove();
		}

		if (needsWrapper(mixin)) {
			this.transpile(inserted);
		}

		// `@contents` is substituted after insertion so the replaced at-rule has a parent.
		// It is substituted after transpilation so passed-in contents are not scoped to the mixin.
		this.replaceContents(inserted, atRule.nodes !== undefined, atRule.nodes || []);

		this.expandNested(inserted, helpers);

		this.expanding.delete(apply.name);
	}

	/** Captures arguments, scopes parameters and `@private` rules, and returns the nodes to insert. */
	private buildBody(atRule: AtRule, args: Array<string>, mixin: Mixin, helpers: Helpers): Array<ChildNode> {
		const cloned = cloneMixinBodyNodes(mixin.atRule);

		if (!needsWrapper(mixin)) {
			return cloned;
		}

		// Arguments are resolved at the call site and captured in the caller's frame.
		// Each supplied argument is bound to a fresh custom property so it can not be
		// shadowed by parameters of nested mixins that reuse the same names.
		// See: https://github.com/w3c/csswg-drafts/issues/14372
		const bodyWrapper = helpers.rule({ selector: '&', source: atRule.source });
		bodyWrapper.raws.semicolon = true;
		this.desugaredNestingRules.add(bodyWrapper);

		let outerWrapper: Rule | undefined;
		let argumentPrivateRule: AtRule | undefined;

		const hasInheritedDefault = mixin.parameters.some((parameter, i) => {
			return i >= args.length && isInheritKeyword(parameter.defaultValue);
		});

		if (mixin.parameters.length > 0 && (args.length > 0 || hasInheritedDefault)) {
			outerWrapper = helpers.rule({ selector: '&', source: atRule.source });
			outerWrapper.raws.semicolon = true;
			this.desugaredNestingRules.add(outerWrapper);

			argumentPrivateRule = helpers.atRule({ name: 'private', source: atRule.source });
			outerWrapper.append(argumentPrivateRule);
			outerWrapper.append(bodyWrapper);
		}

		if (mixin.parameters.length > 0) {
			bodyWrapper.append(this.buildParameterPrivateRule(atRule, args, mixin.parameters, helpers, argumentPrivateRule));
		}

		for (const node of cloned) {
			bodyWrapper.append(node);
		}

		bodyWrapper.cleanRaws();

		if (!argumentPrivateRule?.nodes?.length) {
			return [bodyWrapper];
		}

		outerWrapper?.cleanRaws();

		return [outerWrapper as Rule];
	}

	/** Binds each parameter to its captured argument value, or to its default in the mixin's frame. */
	private buildParameterPrivateRule(atRule: AtRule, args: Array<string>, parameters: Array<MixinParameter>, helpers: Helpers, argumentPrivateRule?: AtRule): AtRule {
		const parameterPrivateRule = helpers.atRule({ name: 'private', source: atRule.source });

		for (let i = 0; i < parameters.length; i++) {
			const parameter = parameters[i];

			let value;

			if (i < args.length) {
				const argumentName = `--arg-${(this.argumentCounter++).toString(36)}`;

				argumentPrivateRule?.append(helpers.decl({
					prop: argumentName,
					value: isInheritKeyword(args[i]) ? `var(${parameter.name})` : args[i],
					source: atRule.source,
				}));

				// The parameter resolves to the captured argument value.
				value = `var(${argumentName})`;
			} else if (argumentPrivateRule && isInheritKeyword(parameter.defaultValue)) {
				const argumentName = `--arg-${(this.argumentCounter++).toString(36)}`;

				// `inherit` on a parameter default resolves to the same-named
				// custom property in the calling context.
				argumentPrivateRule.append(helpers.decl({
					prop: argumentName,
					value: `var(${parameter.name})`,
					source: atRule.source,
				}));

				value = `var(${argumentName})`;
			} else {
				// Missing arguments resolve to their default in the mixin's own frame.
				value = parameter.defaultValue ?? 'initial';
			}

			parameterPrivateRule.append(helpers.decl({
				prop: parameter.name,
				value,
				source: atRule.source,
			}));
		}

		return parameterPrivateRule;
	}

	/** Only `@private` rules that originate from mixins are transpiled here. */
	private transpile(inserted: Array<ChildNode>): void {
		this.registrations.push(...this.privateTranspiler.transpile(inserted));
	}

	/** Mixins applied within this mixin are resolved in the context of the arguments above. */
	private expandNested(inserted: Array<ChildNode>, helpers: Helpers): void {
		const nestedApplies: Array<AtRule> = [];
		for (const node of inserted) {
			collectMatches(node, IS_APPLY_REGEX, nestedApplies);
		}

		for (const nestedAtRule of nestedApplies) {
			if (!nestedAtRule.parent) {
				continue;
			}

			this.expand(nestedAtRule, false, helpers);
		}
	}

	/** Substitutes `@contents` and charges the budget for the duplicated nodes. */
	private replaceContents(nodes: Array<ChildNode>, hasContents: boolean, contents: Array<ChildNode>): void {
		const contentsRules: Array<AtRule> = [];
		for (const node of nodes) {
			collectMatches(node, IS_CONTENTS_REGEX, contentsRules);
		}

		for (const contentsRule of contentsRules) {
			const replacement = hasContents ? contents : (contentsRule.nodes || []);

			this.spendBudget(countNodes(replacement));

			contentsRule.before(replacement.map((child) => child.clone()));
			contentsRule.remove();
		}
	}

	/** Throws once the total number of generated nodes exceeds the budget. */
	private spendBudget(amount: number): void {
		this.generatedNodes += amount;
		if (this.generatedNodes > MAX_GENERATED_NODES) {
			throw new Error('Maximum mixin expansion size exceeded, reduce the complexity of your mixins');
		}
	}
}

function needsWrapper(mixin: Mixin): boolean {
	return mixin.parameters.length > 0 || hasPrivateRules(mixin.atRule);
}

function isInheritKeyword(value: string | undefined): boolean {
	return value !== undefined && value.trim().toLowerCase() === 'inherit';
}

/** `@layer` is invalid in a mixin body and its contents are dropped when applied. */
function cloneMixinBodyNodes(atRule: AtRule): Array<ChildNode> {
	const out: Array<ChildNode> = [];

	for (const node of atRule.nodes || []) {
		if (node.type === 'atrule' && IS_LAYER_REGEX.test(node.name)) {
			continue;
		}

		const clone = node.clone();

		if (clone.type === 'rule' || clone.type === 'atrule') {
			clone.walkAtRules(IS_LAYER_REGEX, (layer) => {
				layer.remove();
			});
		}

		out.push(clone);
	}

	return out;
}

function countNodes(nodes: Array<ChildNode>): number {
	let count = 0;

	for (const node of nodes) {
		count++;

		if (node.type === 'rule' || node.type === 'atrule') {
			count += countNodes(node.nodes || []);
		}
	}

	return count;
}

function hasPrivateRules(atRule: AtRule): boolean {
	let result = false;
	atRule.walkAtRules(IS_PRIVATE_REGEX, () => {
		result = true;
	});

	return result;
}

function collectMatches(node: ChildNode, name: RegExp, out: Array<AtRule>): void {
	if (node.type === 'atrule' && name.test(node.name)) {
		out.push(node);
	}

	if (node.type === 'rule' || node.type === 'atrule') {
		node.walkAtRules(name, (atRule) => {
			out.push(atRule);
		});
	}
}

function hasMixinAncestor(atRule: AtRule): boolean {
	let parent: AtRule['parent'] = atRule.parent;
	while (parent) {
		if (parent.type === 'atrule' && parent.name.toLowerCase() === 'mixin') {
			return true;
		}

		parent = parent.parent as AtRule['parent'];
	}

	return false;
}
