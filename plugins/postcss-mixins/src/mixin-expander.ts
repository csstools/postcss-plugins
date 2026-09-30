import { AtRule, Declaration, Rule } from 'postcss';
import type { ChildNode, Node, Root } from 'postcss';
import { Transpiler } from '@csstools/postcss-private-rule';
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
const IS_NESTING_GROUP_RULE_REGEX = /^(container|layer|media|scope|starting-style|supports)$/i;

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
	private transpiler: Transpiler = new Transpiler();
	private argumentCounter = 0;
	private desugaredNestingRules: Set<Rule> = new Set();
	private expanding: Set<string> = new Set();

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
	expandAll(root: Root, preserve: boolean): void {
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

			this.expand(atRule, preserve);
		}
	}

	/** Removes the temporary `& {}` nesting rules created while desugaring. */
	finish(): void {
		for (const wrapper of this.desugaredNestingRules) {
			wrapper.replaceWith(...wrapper.nodes || []);
		}

		this.desugaredNestingRules.clear();
	}

	private expand(atRule: AtRule, preserve: boolean): void {
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

		const inserted = this.buildBody(atRule, apply.arguments, mixin);

		for (const node of inserted) {
			atRule.before(node);
		}

		if (!preserve) {
			atRule.remove();
		}

		if (needsWrapper(mixin)) {
			this.transpile(inserted);
		}

		// `@contents` is substituted after insertion so the replaced at-rule has a parent.
		// It is substituted after transpilation so passed-in contents are not scoped to the mixin.
		replaceContents(inserted, atRule.nodes !== undefined, atRule.nodes || []);

		this.expandNested(inserted);

		this.expanding.delete(apply.name);
	}

	/** Captures arguments, scopes parameters and `@private` rules, and returns the nodes to insert. */
	private buildBody(atRule: AtRule, args: Array<string>, mixin: Mixin): Array<ChildNode> {
		const cloned: Array<ChildNode> = (mixin.atRule.nodes || []).map((node) => node.clone());

		if (!needsWrapper(mixin)) {
			return cloned;
		}

		// Arguments are resolved at the call site and captured in the caller's frame.
		// Each supplied argument is bound to a fresh custom property so it can not be
		// shadowed by parameters of nested mixins that reuse the same names.
		// See: https://github.com/w3c/csswg-drafts/issues/14372
		const bodyWrapper = new Rule({ selector: '&', source: atRule.source });
		bodyWrapper.raws.semicolon = true;
		this.desugaredNestingRules.add(bodyWrapper);

		let outerWrapper: Rule | undefined;
		let argumentPrivateRule: AtRule | undefined;

		if (mixin.parameters.length > 0 && args.length > 0) {
			outerWrapper = new Rule({ selector: '&', source: atRule.source });
			outerWrapper.raws.semicolon = true;
			this.desugaredNestingRules.add(outerWrapper);

			argumentPrivateRule = new AtRule({ name: 'private', source: atRule.source });
			outerWrapper.append(argumentPrivateRule);
			outerWrapper.append(bodyWrapper);
		}

		if (mixin.parameters.length > 0) {
			bodyWrapper.append(this.buildParameterPrivateRule(atRule, args, mixin.parameters, argumentPrivateRule));
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
	private buildParameterPrivateRule(atRule: AtRule, args: Array<string>, parameters: Array<MixinParameter>, argumentPrivateRule?: AtRule): AtRule {
		const parameterPrivateRule = new AtRule({ name: 'private', source: atRule.source });

		for (let i = 0; i < parameters.length; i++) {
			const parameter = parameters[i];

			let value;

			if (i < args.length) {
				const argumentName = `--arg-${(this.argumentCounter++).toString(36)}`;

				argumentPrivateRule?.append(new Declaration({
					prop: argumentName,
					value: args[i],
					source: atRule.source,
				}));

				// The parameter resolves to the captured argument value.
				value = `var(${argumentName})`;
			} else {
				// Missing arguments resolve to their default in the mixin's own frame.
				value = parameter.defaultValue || 'initial';
			}

			parameterPrivateRule.append(new Declaration({
				prop: parameter.name,
				value,
				source: atRule.source,
			}));
		}

		return parameterPrivateRule;
	}

	/** Only `@private` rules that originate from mixins are transpiled here. */
	private transpile(inserted: Array<ChildNode>): void {
		const privateRules: Array<AtRule> = [];
		for (const node of inserted) {
			collectMatches(node, IS_PRIVATE_REGEX, privateRules);
		}

		for (const privateRule of privateRules) {
			const owner = findOwningRule(privateRule);
			if (!owner) {
				continue;
			}

			this.transpiler.registerAndRemovePrivateRules(privateRule, owner);
		}

		const declarations: Array<Declaration> = [];
		const atRules: Array<AtRule> = [];
		for (const node of inserted) {
			collectDeclarationsAndAtRules(node, declarations, atRules);
		}

		for (const declaration of declarations) {
			this.transpiler.transpileDeclaration(declaration);
		}

		for (const nestedAtRule of atRules) {
			this.transpiler.transpileAtRule(nestedAtRule);
		}
	}

	/** Mixins applied within this mixin are resolved in the context of the arguments above. */
	private expandNested(inserted: Array<ChildNode>): void {
		const nestedApplies: Array<AtRule> = [];
		for (const node of inserted) {
			collectMatches(node, IS_APPLY_REGEX, nestedApplies);
		}

		for (const nestedAtRule of nestedApplies) {
			if (!nestedAtRule.parent) {
				continue;
			}

			this.expand(nestedAtRule, false);
		}
	}
}

function needsWrapper(mixin: Mixin): boolean {
	return mixin.parameters.length > 0 || hasPrivateRules(mixin.atRule);
}

function replaceContents(nodes: Array<ChildNode>, hasContents: boolean, contents: Array<ChildNode>): void {
	const contentsRules: Array<AtRule> = [];
	for (const node of nodes) {
		collectMatches(node, IS_CONTENTS_REGEX, contentsRules);
	}

	for (const contentsRule of contentsRules) {
		const replacement = hasContents ? contents : (contentsRule.nodes || []);

		for (const child of replacement) {
			contentsRule.before(child.clone());
		}

		contentsRule.remove();
	}
}

function hasPrivateRules(atRule: AtRule): boolean {
	let result = false;
	atRule.walkAtRules(IS_PRIVATE_REGEX, () => {
		result = true;
	});

	return result;
}

function findOwningRule(node: ChildNode): Rule | false {
	let parent: Node | undefined = node.parent;
	while (parent) {
		if (parent.type === 'rule') {
			return parent as Rule;
		}

		if (parent.type === 'atrule' && IS_NESTING_GROUP_RULE_REGEX.test((parent as AtRule).name)) {
			parent = parent.parent;
			continue;
		}

		return false;
	}

	return false;
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

function collectDeclarationsAndAtRules(node: ChildNode, declarations: Array<Declaration>, atRules: Array<AtRule>): void {
	if (node.type === 'decl') {
		declarations.push(node);
	} else if (node.type === 'atrule') {
		atRules.push(node);
	}

	if (node.type === 'rule' || node.type === 'atrule') {
		node.walk((child) => {
			if (child.type === 'decl') {
				declarations.push(child);
			} else if (child.type === 'atrule') {
				atRules.push(child);
			}
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
