import { AtRule, Declaration, Rule } from 'postcss';
import type { ChildNode, Node, Plugin, PluginCreator } from 'postcss';
import { Transpiler } from '@csstools/postcss-private-rule';
import { IS_APPLY_REGEX, processableApplyRule } from './processable-apply';
import type { MixinParameter } from './processable-mixin';
import { processableMixinRule } from './processable-mixin';

/** postcss-mixins plugin options */
export type pluginOptions = {
	/** Preserve the original notation. default: false */
	preserve?: boolean,
};

type Mixin = {
	name: string,
	parameters: Array<MixinParameter>,
	atRule: AtRule,
};

type State = {
	argumentCounter: number,
};

const IS_CONTENTS_REGEX = /^contents$/i;
const IS_PRIVATE_REGEX = /^private$/i;
const IS_NESTING_GROUP_RULE_REGEX = /^(container|layer|media|scope|starting-style|supports)$/i;

const creator: PluginCreator<pluginOptions> = (opts?: pluginOptions) => {
	const options: pluginOptions = Object.assign(
		// Default options
		{
			preserve: false,
		},
		// Provided options
		opts,
	);

	return {
		postcssPlugin: 'postcss-mixins',
		prepare(): Plugin {
			const mixins: Map<string, Mixin> = new Map();
			const knownMixins: Set<string> = new Set();
			const transpiler = new Transpiler();
			const state: State = { argumentCounter: 0 };

			return {
				postcssPlugin: 'mixins',
				Once(root): void {
					root.each((child) => {
						if (child.type !== 'atrule') {
							return;
						}

						const parsed = processableMixinRule(child);
						if (!parsed) {
							return;
						}

						// TODO: support mixin overrides
						if (knownMixins.has(parsed.name)) {
							mixins.delete(parsed.name);
							return;
						}

						mixins.set(parsed.name, Object.assign({}, parsed, { atRule: child }));
						knownMixins.add(parsed.name);
					});

					if (!options.preserve) {
						for (const mixin of mixins.values()) {
							mixin.atRule.remove();
						}
					}

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

						expandApply(atRule, mixins, transpiler, options.preserve === true, new Set(), state);
					}
				},
			};
		},
	};
};

function expandApply(atRule: AtRule, mixins: Map<string, Mixin>, transpiler: Transpiler, preserve: boolean, stack: Set<string>, state: State): void {
	const apply = processableApplyRule(atRule);
	if (!apply) {
		return;
	}

	const mixin = mixins.get(apply.name);
	if (!mixin) {
		return;
	}

	// Guard against mixins that (indirectly) apply themselves.
	if (stack.has(apply.name)) {
		return;
	}

	// Passing more arguments than the mixin accepts is invalid.
	if (apply.arguments.length > mixin.parameters.length) {
		return;
	}

	const cloned: Array<ChildNode> = (mixin.atRule.nodes || []).map((node) => node.clone());

	const hasSuppliedArguments = apply.arguments.length > 0;
	const needsWrapper = mixin.parameters.length > 0 || hasPrivateRules(mixin.atRule);

	const inserted: Array<ChildNode> = [];

	if (needsWrapper) {
		// Arguments are resolved at the call site and captured in the caller's frame.
		// Each supplied argument is bound to a fresh custom property so it can not be
		// shadowed by parameters of nested mixins that reuse the same names.
		// See: https://github.com/w3c/csswg-drafts/issues/14372
		const bodyWrapper = new Rule({ selector: '&', source: atRule.source });
		bodyWrapper.raws.semicolon = true;

		let outerWrapper: Rule | undefined;
		let argumentPrivateRule: AtRule | undefined;

		if (mixin.parameters.length > 0 && hasSuppliedArguments) {
			outerWrapper = new Rule({ selector: '&', source: atRule.source });
			outerWrapper.raws.semicolon = true;

			argumentPrivateRule = new AtRule({ name: 'private', source: atRule.source });
			outerWrapper.append(argumentPrivateRule);
			outerWrapper.append(bodyWrapper);
		}

		if (mixin.parameters.length > 0) {
			const parameterPrivateRule = new AtRule({ name: 'private', source: atRule.source });

			for (let i = 0; i < mixin.parameters.length; i++) {
				const parameter = mixin.parameters[i];
				const supplied = apply.arguments[i];

				let value;

				if (i < apply.arguments.length) {
					const argumentName = `--arg-${(state.argumentCounter++).toString(36)}`;

					argumentPrivateRule?.append(new Declaration({
						prop: argumentName,
						value: supplied,
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

			bodyWrapper.append(parameterPrivateRule);
		}

		for (const node of cloned) {
			bodyWrapper.append(node);
		}

		bodyWrapper.cleanRaws();

		if (outerWrapper && !argumentPrivateRule?.nodes?.length) {
			outerWrapper = undefined;
		}

		if (outerWrapper) {
			outerWrapper.cleanRaws();
			inserted.push(outerWrapper);
		} else {
			inserted.push(bodyWrapper);
		}
	} else {
		inserted.push(...cloned);
	}

	for (const node of inserted) {
		atRule.before(node);
	}

	if (!preserve) {
		atRule.remove();
	}

	if (needsWrapper) {
		// Only `@private` rules that originate from mixins are transpiled here.
		const privateRules: Array<AtRule> = [];
		for (const node of inserted) {
			collectPrivateRules(node, privateRules);
		}

		for (const privateRule of privateRules) {
			const owner = findOwningRule(privateRule);
			if (!owner) {
				continue;
			}

			transpiler.registerAndRemovePrivateRules(privateRule, owner);
		}

		const declarations: Array<Declaration> = [];
		const atRules: Array<AtRule> = [];
		for (const node of inserted) {
			collectDeclarationsAndAtRules(node, declarations, atRules);
		}

		for (const declaration of declarations) {
			transpiler.transpileDeclaration(declaration);
		}

		for (const nestedAtRule of atRules) {
			transpiler.transpileAtRule(nestedAtRule);
		}
	}

	// `@contents` is substituted after insertion so the replaced at-rule has a parent.
	// It is substituted after transpilation so passed-in contents are not scoped to the mixin.
	replaceContents(inserted, atRule.nodes !== undefined, atRule.nodes || []);

	// Mixins applied within this mixin are resolved in the context of the arguments above.
	const nestedStack = new Set(stack);
	nestedStack.add(apply.name);

	const nestedApplies: Array<AtRule> = [];
	for (const node of inserted) {
		collectApplyRules(node, nestedApplies);
	}

	for (const nestedAtRule of nestedApplies) {
		if (!nestedAtRule.parent) {
			continue;
		}

		expandApply(nestedAtRule, mixins, transpiler, false, nestedStack, state);
	}
}

function replaceContents(nodes: Array<ChildNode>, hasContents: boolean, contents: Array<ChildNode>): void {
	const contentsRules: Array<AtRule> = [];
	for (const node of nodes) {
		collectContentsRules(node, contentsRules);
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

function collectApplyRules(node: ChildNode, out: Array<AtRule>): void {
	if (node.type === 'atrule' && IS_APPLY_REGEX.test(node.name)) {
		out.push(node);
	}

	if (node.type === 'rule' || node.type === 'atrule') {
		node.walkAtRules(IS_APPLY_REGEX, (atRule) => {
			out.push(atRule);
		});
	}
}

function collectContentsRules(node: ChildNode, out: Array<AtRule>): void {
	if (node.type === 'atrule' && IS_CONTENTS_REGEX.test(node.name)) {
		out.push(node);
	}

	if (node.type === 'rule' || node.type === 'atrule') {
		node.walkAtRules(IS_CONTENTS_REGEX, (atRule) => {
			out.push(atRule);
		});
	}
}

function collectPrivateRules(node: ChildNode, out: Array<AtRule>): void {
	if (node.type === 'atrule' && IS_PRIVATE_REGEX.test(node.name)) {
		out.push(node);
	}

	if (node.type === 'rule' || node.type === 'atrule') {
		node.walkAtRules(IS_PRIVATE_REGEX, (atRule) => {
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

creator.postcss = true;

export default creator;
export { creator as 'module.exports' };
