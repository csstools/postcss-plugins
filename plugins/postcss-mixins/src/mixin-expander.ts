import type { AtRule, ChildNode, Helpers, Root, Rule } from 'postcss';
import type { PrivatePropertyTranspiler } from '@csstools/utilities-for-private-properties';
import { createPrivatePropertyTranspiler } from '@csstools/utilities-for-private-properties';
import type { Mixin, MixinDefinitions } from './mixin-definitions';
import { IS_APPLY_REGEX, IS_NESTING_GROUP_RULE_REGEX, applySiteRule, processableApplyRule } from './processable-apply';
import type { MixinParameter } from './processable-mixin';

const IS_CONTENTS_REGEX = /^contents$/i;
const IS_LAYER_REGEX = /^layer$/i;

// Mixins can reference each other and duplicate subtrees, which can grow
// exponentially. Bound the total number of nodes generated while expanding
// mixins so that a small stylesheet can not exhaust memory or CPU.
const MAX_GENERATED_NODES = 100_000;

/**
 * Deepens mixin expansion behind a small interface:
 * expand the `@apply` rules of one stylesheet, then finish.
 *
 * Everything else — argument capture, wrapper construction, private scoping and
 * `@contents` substitution — is internal.
 */
export class MixinExpander {
	private definitions: MixinDefinitions;
	private preserve: boolean;
	private expansionTranspiler: PrivatePropertyTranspiler;
	private authorTranspiler: PrivatePropertyTranspiler;
	private registrations: Array<AtRule> = [];
	private argumentCounter = 0;
	private desugaredNestingRules: Set<Rule> = new Set();
	private expansionRules: Set<Rule> = new Set();
	private applyingRules: Set<Rule> = new Set();
	private generatedNodes = 0;

	constructor(definitions: MixinDefinitions, preserve: boolean) {
		this.definitions = definitions;
		this.preserve = preserve;
		this.expansionTranspiler = createPrivatePropertyTranspiler({ namespace: 'm', allowUntranspiledMixins: true });
		this.authorTranspiler = createPrivatePropertyTranspiler({ namespace: 'p', allowUntranspiledMixins: true, preserve });
	}

	/** Expands all `@apply` rules in `root`, except those authored inside a `@mixin`. */
	expandAll(root: Root, helpers: Helpers): void {
		this.generatedNodes = 0;

		const applies: Array<AtRule> = [];
		root.walkAtRules(IS_APPLY_REGEX, (atRule) => {
			if (hasMixinAncestor(atRule)) {
				return;
			}

			applies.push(atRule);
		});

		const appliesByRule: Map<Rule, Array<AtRule>> = new Map();
		for (const atRule of applies) {
			const apply = processableApplyRule(atRule);
			if (!apply) {
				continue;
			}

			const rule = applySiteRule(atRule);
			if (!rule) {
				continue;
			}

			const ruleApplies = appliesByRule.get(rule) ?? [];
			ruleApplies.push(atRule);
			appliesByRule.set(rule, ruleApplies);
		}

		// A rule with an `@apply` for a mixin that can not be transpiled must stay
		// untouched, together with every rule it is nested in. Expanding the other
		// rules that still apply to the same elements would either drop styles or
		// mix native and transpiled output.
		const blocked: Set<Rule> = new Set();
		for (const [rule, ruleApplies] of appliesByRule) {
			for (const atRule of ruleApplies) {
				const apply = processableApplyRule(atRule);
				if (!apply || !this.definitions.unsupported.has(apply.name)) {
					continue;
				}

				blockRuleAndAncestors(rule, blocked);
				break;
			}
		}

		for (const [rule, ruleApplies] of appliesByRule) {
			if (isBlocked(rule, blocked)) {
				continue;
			}

			for (const atRule of ruleApplies) {
				this.expand(atRule, this.preserve, helpers);
			}

			collectRuleAndAncestors(rule, this.applyingRules);
		}
	}

	/** Removes temporary wrappers, transpiles private properties and appends registrations to the root. */
	finish(root: Root): void {
		for (const wrapper of this.desugaredNestingRules) {
			wrapper.replaceWith(...wrapper.nodes || []);
		}

		this.desugaredNestingRules.clear();

		for (const rule of this.applyingRules) {
			if (!isOutermost(rule, this.applyingRules)) {
				continue;
			}

			this.registrations.push(...this.authorTranspiler.transpile([rule]));
		}

		this.applyingRules.clear();
		this.expansionRules.clear();

		root.append(...this.registrations);
		this.registrations = [];
	}

	private expand(atRule: AtRule, preserve: boolean, helpers: Helpers): void {
		const apply = processableApplyRule(atRule);
		if (!apply) {
			return;
		}

		const mixin = this.definitions.mixins.get(apply.name);
		if (!mixin) {
			return;
		}

		// Passing more arguments than the mixin accepts is invalid.
		// The application does nothing, so the `@apply` rule is left in place.
		if (apply.arguments.length > mixin.parameters.length) {
			return;
		}

		const siteRule = applySiteRule(atRule);
		const hasContents = atRule.nodes !== undefined;

		const inserted = this.buildBody(atRule, apply.arguments, mixin, helpers);
		this.spendBudget(countNodes(inserted));

		// Insert as a batch: PostCSS resolves the index of `atRule` with
		// `indexOf` for every single `before()` call, which is quadratic.
		atRule.before(inserted);

		if (!preserve) {
			atRule.remove();
		}

		this.registerExpansionRules(inserted);
		this.transpileExpansion(inserted);

		// `@contents` is substituted after insertion so the replaced at-rule has a parent.
		this.replaceContents(inserted, hasContents, atRule.nodes || [], siteRule);

		this.expandNested(inserted, helpers);
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
	private transpileExpansion(inserted: Array<ChildNode>): void {
		this.registrations.push(...this.expansionTranspiler.transpile(inserted));
	}

	private transpileContents(contents: Array<ChildNode>, siteRule: Rule): void {
		const transpiler = this.expansionRules.has(siteRule) ? this.expansionTranspiler : this.authorTranspiler;
		this.registrations.push(...transpiler.transpile(contents, { scope: siteRule }));
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
	private replaceContents(nodes: Array<ChildNode>, hasContents: boolean, contents: Array<ChildNode>, siteRule: Rule | null): void {
		const contentsRules: Array<AtRule> = [];
		for (const node of nodes) {
			collectMatches(node, IS_CONTENTS_REGEX, contentsRules);
		}

		for (const contentsRule of contentsRules) {
			const replacement = hasContents ? contents : (contentsRule.nodes || []);

			this.spendBudget(countNodes(replacement));

			const substituted = replacement.map((child) => child.clone());

			contentsRule.before(substituted);
			contentsRule.remove();

			this.registerExpansionRules(substituted);

			if (hasContents && siteRule) {
				// Passed-in contents are scoped to the apply site.
				this.transpileContents(substituted, siteRule);
				continue;
			}

			// A fallback block is authored in the mixin body. Declarations in it are
			// part of the mixin scope and may define private properties.
			this.transpileExpansion(substituted);
		}
	}

	private registerExpansionRules(nodes: Array<ChildNode>): void {
		for (const node of nodes) {
			if (node.type === 'rule') {
				this.expansionRules.add(node);
			}

			if (node.type === 'rule' || node.type === 'atrule') {
				node.walkRules((rule) => {
					this.expansionRules.add(rule);
				});
			}
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
	atRule.walkAtRules(/^private$/i, () => {
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

function blockRuleAndAncestors(rule: Rule, blocked: Set<Rule>): void {
	let current: Rule | null = rule;

	while (current) {
		blocked.add(current);
		current = parentStyleRule(current);
	}
}

function isBlocked(rule: Rule, blocked: Set<Rule>): boolean {
	let current: Rule | null = rule;

	while (current) {
		if (blocked.has(current)) {
			return true;
		}

		current = parentStyleRule(current);
	}

	return false;
}

function collectRuleAndAncestors(rule: Rule, out: Set<Rule>): void {
	let current: Rule | null = rule;

	while (current) {
		out.add(current);
		current = parentStyleRule(current);
	}
}

function isOutermost(rule: Rule, rules: Set<Rule>): boolean {
	let parent = parentStyleRule(rule);

	while (parent) {
		if (rules.has(parent)) {
			return false;
		}

		parent = parentStyleRule(parent);
	}

	return true;
}

function parentStyleRule(rule: Rule): Rule | null {
	let parent = rule.parent;

	while (parent) {
		if (parent.type === 'rule') {
			return parent;
		}

		if (parent.type !== 'atrule' || !IS_NESTING_GROUP_RULE_REGEX.test(parent.name)) {
			return null;
		}

		parent = parent.parent;
	}

	return null;
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
