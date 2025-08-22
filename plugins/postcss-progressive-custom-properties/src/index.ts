import type { Plugin } from 'postcss';
import { type Node, type AtRule, type PluginCreator, type Container } from 'postcss';
import { conditionsFromValue } from './conditions-from-values';

const HAS_VARIABLE_FUNCTION_REGEX = /var\(/i;
const IS_INITIAL_REGEX = /^initial$/i;
const EMPTY_OR_WHITESPACE_REGEX = /^\s*$/;

type State = {
	conditionalRules: Array<AtRule>,
	propNames: Set<string>,
	lastConditionParams: {
		support: string | undefined,
	},
	lastConditionalRule: Container | undefined,
}

const creator: PluginCreator<null> = () => {
	return {
		postcssPlugin: 'postcss-progressive-custom-properties',
		prepare(): Plugin {
			const states = new WeakMap<Node, State>();

			return {
				postcssPlugin: 'postcss-progressive-custom-properties',
				OnceExit(root, { postcss }): void {
					root.walkDecls((decl) => {
						if (!decl.parent) {
							return;
						}

						const state = states.get(decl.parent) || {
							conditionalRules: [],
							propNames: new Set<string>(),
							lastConditionParams: {
								support: undefined,
							},
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

						if (!(decl.variable || HAS_VARIABLE_FUNCTION_REGEX.test(decl.value))) {
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

						const conditions = conditionsFromValue(decl, mustContainVar);
						const supportParams = conditions.support.join(' and ');
						if (!supportParams) {
							return;
						}

						if (state.lastConditionParams.support !== supportParams) {
							state.lastConditionalRule = undefined;
						}

						if (state.lastConditionalRule) {
							state.lastConditionalRule.append(decl.clone());
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

						parentClone.append(decl.clone());
						decl.remove();

						state.lastConditionParams.support = supportParams;
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
