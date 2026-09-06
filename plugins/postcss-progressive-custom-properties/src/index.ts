import type { ChildNode, Declaration, Document, Plugin } from 'postcss';
import { type Node, type AtRule, type PluginCreator, type Container } from 'postcss';
import { conditionsFromValue } from './conditions-from-values';
import { shorthands } from './shorthands';

const HAS_VARIABLE_FUNCTION_REGEX = /var\(/i;
const IS_INITIAL_REGEX = /^initial$/i;
const IS_PROPERTY_REGEX = /^property$/i;
const IS_KEYFRAMES_REGEX = /^keyframes$/i;
const IS_SUPPORTS_REGEX = /^supports$/i;
const EMPTY_OR_WHITESPACE_REGEX = /^\s*$/;

type State = {
	conditionalRules: Array<AtRule>,
	propNames: Set<string>,
	lastConditionParams: string | undefined,
	lastConditionalRule: Container | undefined,
};

function inKeyframes(decl: Declaration): AtRule | void {
	let parent: typeof decl.parent | Document = decl.parent;
	while (parent) {
		if (parent.type === 'atrule' && IS_KEYFRAMES_REGEX.test(parent.name)) {
			return parent;
		}

		parent = parent.parent;
	}
}

function inSupports(atRule: AtRule): AtRule | void {
	let parent: typeof atRule.parent | Document = atRule.parent;
	while (parent) {
		if (parent.type === 'atrule' && IS_SUPPORTS_REGEX.test(parent.name)) {
			return parent;
		}

		parent = parent.parent;
	}
}

function cloneDeclarations(target: Container<ChildNode>, decl: Declaration): void {
	if (target.type === 'atrule' && IS_PROPERTY_REGEX.test((target as AtRule).name)) {
		decl.parent?.each((d) => {
			if (d.type === 'decl' && d.prop === decl.prop) {
				return;
			}

			target.append(d.clone());
		});

		target.append(decl.clone());
		return;
	}

	const longhands = shorthands.get(decl.prop.toLowerCase());
	if (!longhands?.length) {
		target.append(decl.clone());
		return;
	}

	const list = [
		decl
	];

	let next = decl.next();
	while (next) {
		if (next.type === 'decl' && longhands.includes(next.prop)) {
			list.push(next);
		}

		next = next.next();
	}

	list.forEach((x) => {
		target.append(x.clone());
	});
}

const creator: PluginCreator<null> = () => {
	return {
		postcssPlugin: 'postcss-progressive-custom-properties',
		prepare(): Plugin {
			const states = new WeakMap<Node, State>();

			return {
				postcssPlugin: 'postcss-progressive-custom-properties',
				OnceExit(root, { postcss }): void {
					root.walkAtRules((atRule) => {
						if (!IS_KEYFRAMES_REGEX.test(atRule.name)) {
							return;
						}

						if (inSupports(atRule)) {
							return;
						}

						const conditions: Array<string> = [];

						const state = {
							propNames: new Set<string>(),
						};

						const atRuleClone = atRule.clone();

						atRule.walkDecls((decl) => {
							let prop = decl.prop;
							if (!decl.variable) {
								prop = decl.prop.toLowerCase();
							}

							if (!state.propNames.has(prop)) {
								state.propNames.add(prop);
								return;
							}

							if (
								!decl.variable &&
								!HAS_VARIABLE_FUNCTION_REGEX.test(decl.value)
							) {
								return;
							}

							if (IS_INITIAL_REGEX.test(decl.value)) {
								// https://www.w3.org/TR/css-variables-1/#guaranteed-invalid
								return;
							}

							if (EMPTY_OR_WHITESPACE_REGEX.test(decl.value)) { // empty string value
								// https://www.w3.org/TR/css-variables-1/#guaranteed-invalid
								return;
							}

							// if the property itself isn't a custom property, the value must contain a var() function
							const mustContainVar = !decl.variable;

							const newConditions = conditionsFromValue(decl, mustContainVar);
							if (!newConditions.length) {
								return;
							}

							conditions.push(...newConditions);
							decl.remove();
						});

						if (!conditions.length) {
							return;
						}

						const supportParams = Array.from(new Set(conditions)).sort().join(' and ');
						if (!supportParams) {
							return;
						}

						const supportsRule = postcss.atRule({
							name: 'supports',
							params: supportParams,
							source: atRule.source,
							raws: {
								before: '\n\n',
								after: '\n',
							},
						});

						supportsRule.append(atRuleClone);

						atRule.after(supportsRule);
					});

					root.walkDecls((decl) => {
						if (!decl.parent) {
							return;
						}

						if (inKeyframes(decl)) {
							return;
						}

						const state = states.get(decl.parent) || {
							conditionalRules: [],
							propNames: new Set<string>(),
							lastConditionParams: undefined,
							lastConditionalRule: undefined,
						};

						states.set(decl.parent, state);

						// The first encountered property is the fallback for the oldest targets.
						if (decl.variable) {
							// custom properties are case-sensitive
							if (!state.propNames.has(decl.prop)) {
								state.propNames.add(decl.prop);
								return;
							}
						} else {
							// regular properties are case-insensitive
							const lowerCaseProp = decl.prop.toLowerCase();
							if (!state.propNames.has(lowerCaseProp)) {
								state.propNames.add(lowerCaseProp);
								return;
							}
						}

						if (
							!decl.variable &&
							!(decl.parent.type === 'atrule' && IS_PROPERTY_REGEX.test(decl.parent.name)) &&
							!HAS_VARIABLE_FUNCTION_REGEX.test(decl.value)
						) {
							return;
						}

						if (IS_INITIAL_REGEX.test(decl.value)) {
							// https://www.w3.org/TR/css-variables-1/#guaranteed-invalid
							return;
						}

						if (EMPTY_OR_WHITESPACE_REGEX.test(decl.value)) { // empty string value
							// https://www.w3.org/TR/css-variables-1/#guaranteed-invalid
							return;
						}

						// if the property itself isn't a custom property, the value must contain a var() function
						const mustContainVar = !decl.variable && !(decl.parent.type === 'atrule' && IS_PROPERTY_REGEX.test(decl.parent.name));

						const conditions = conditionsFromValue(decl, mustContainVar);
						const supportParams = conditions.join(' and ');
						if (!supportParams) {
							return;
						}

						if (state.lastConditionParams !== supportParams) {
							state.lastConditionalRule = undefined;
						}

						if (state.lastConditionalRule) {
							cloneDeclarations(state.lastConditionalRule, decl);
							decl.remove();
							return;
						}

						const atRules = [];

						if (supportParams) {
							atRules.push(postcss.atRule({
								name: 'supports',
								params: supportParams,
								source: decl.parent.source,
								raws: {
									before: '\n\n',
									after: '\n',
								},
							}));
						}

						if (!atRules.length) {
							return;
						}

						for (let i = 0; i < (atRules.length - 1); i++) {
							const x = atRules[i];
							const y = atRules[i + 1];

							x.append(y);
						}

						const outerAtRule = atRules[0];
						const innerAtRule = atRules[atRules.length - 1];

						const parentClone = decl.parent.clone();
						parentClone.removeAll();

						parentClone.raws.before = '\n';

						cloneDeclarations(parentClone, decl);
						decl.remove();

						state.lastConditionParams = supportParams;
						state.lastConditionalRule = parentClone;

						innerAtRule.append(parentClone);
						state.conditionalRules.push(outerAtRule);
					});

					root.walk((node) => {
						const state = states.get(node);
						if (!state) {
							return;
						}

						if (state.conditionalRules.length === 0) {
							return;
						}

						// rule.after reverses the at rule order.
						// reversing the call order gives in the correct order overall.
						state.conditionalRules.reverse().forEach((atSupports) => {
							node.after(atSupports);
						});
					});
				},
			};
		},
	};
};

creator.postcss = true;

export default creator;
export { creator as 'module.exports' };
