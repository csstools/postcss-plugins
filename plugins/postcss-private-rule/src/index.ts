import type { Plugin, PluginCreator, Rule } from 'postcss';
import crypto from 'node:crypto';
import path from 'node:path';
import { findPrivateRule, findStyleRule, IS_PRIVATE_RULE_REGEX } from './valid-atrules';
import { isTokenIdent, mutateIdent, tokenize } from '@csstools/css-tokenizer';
import { isFunctionNode, isTokenNode, isWhiteSpaceOrCommentNode, parseListOfComponentValues, stringify, walk } from '@csstools/css-parser-algorithms';

const HAS_VAR_OR_IF_FUNCTION_REGEX = /\b(var|if)\(/i;
const IS_CONTAINER_REGEX = /^container$/i;
const IS_IF_FUNCTION_REGEX = /^if$/i;
const IS_STYLE_FUNCTION_REGEX = /^style$/i;
const IS_VAR_FUNCTION_REGEX = /^var$/i;

/** postcss-private-rule plugin options */
export type pluginOptions = never;

const creator: PluginCreator<pluginOptions> = () => {
	return {
		postcssPlugin: 'postcss-private-rule',
		prepare(): Plugin {
			const privatePropertyNamePrefixes: WeakMap<Rule, string> = new Map();
			const privatePropertyNames: Set<string> = new Set();

			let counter = 0;
			const propertyNamePrefix = (rule: Rule): string => {
				const existing = privatePropertyNamePrefixes.get(rule);
				if (existing) {
					return existing;
				}

				let fromHash;
				if (rule.source?.input.from) {
					const hash = crypto.createHash('md5');
					hash.update(path.basename(path.dirname(rule.source?.input.from)) + '/' + path.basename(rule.source?.input.from), 'utf8');
					fromHash = hash.digest('hex').slice(0, 8);
				} else {
					const hash = crypto.createHash('md5');
					hash.update('<input>', 'utf8');
					fromHash = hash.digest('hex').slice(0, 8);
				}

				const prefix = `--_csstools-p-${fromHash}-${counter.toString(16)}`;
				counter++;

				privatePropertyNamePrefixes.set(rule, prefix);

				return prefix;
			};

			return {
				postcssPlugin: 'postcss-private-rule',
				Once(root): void {
					root.walkAtRules(IS_PRIVATE_RULE_REGEX, (atRule) => {
						const styleRule = findStyleRule(atRule);
						if (!styleRule) {
							return;
						}

						if (!atRule.nodes?.length) {
							return;
						}

						const prefix = propertyNamePrefix(styleRule);

						{
							atRule.walk((node) => {
								if (node.type === 'decl' && node.variable && node.prop.startsWith('--')) {
									privatePropertyNames.add(node.prop);

									node.prop = `${prefix}${node.prop}`;

									return;
								}

								if (node.type === 'atrule' && findPrivateRule(node) === atRule) {
									return;
								}

								node.remove();
							});

							atRule.nodes.forEach((node) => {
								atRule.before(node.clone());
							});

							atRule.remove();
						}

						{
							styleRule.walkDecls((decl) => {
								if (!HAS_VAR_OR_IF_FUNCTION_REGEX.test(decl.value)) return;

								const componentValues = parseListOfComponentValues(tokenize({ css: decl.value }));

								walk(componentValues, (entry) => {
									if (!isFunctionNode(entry.node)) {
										return;
									}

									if (IS_VAR_FUNCTION_REGEX.test(entry.node.getName())) {
										const args = entry.node.value;
										for (let i = 0; i < args.length; i++) {
											const arg = args[i];

											if (isWhiteSpaceOrCommentNode(arg)) continue;

											if (!isTokenNode(arg) || !isTokenIdent(arg.value) || !arg.value[4].value.startsWith('--')) break;

											if (!privatePropertyNames.has(arg.value[4].value)) break;

											mutateIdent(arg.value, `${prefix}${arg.value[4].value}`);
											break;
										}

										return;
									}

									if (IS_IF_FUNCTION_REGEX.test(entry.node.getName())) {
										const args = entry.node.value;
										for (let i = 0; i < args.length; i++) {
											const arg = args[i];

											if (isWhiteSpaceOrCommentNode(arg)) continue;

											if (!isFunctionNode(arg) || !IS_STYLE_FUNCTION_REGEX.test(arg.getName())) break;

											const childArgs = arg.value;
											for (let j = 0; j < childArgs.length; j++) {
												const childArg = childArgs[j];

												if (isWhiteSpaceOrCommentNode(childArg)) continue;

												if (!isTokenNode(childArg) || !isTokenIdent(childArg.value) || !childArg.value[4].value.startsWith('--')) break;

												if (!privatePropertyNames.has(childArg.value[4].value)) break;

												mutateIdent(childArg.value, `${prefix}${childArg.value[4].value}`);
												break;
											}
										}
									}
								});

								decl.value = stringify([componentValues]);
							});
						}

						{
							styleRule.walkAtRules((nestedAtRule) => {
								if (!IS_CONTAINER_REGEX.test(nestedAtRule.name)) return;

								if (!nestedAtRule.params.includes('--')) return;

								const componentValues = parseListOfComponentValues(tokenize({ css: nestedAtRule.params }));

								walk(componentValues, (entry) => {
									if (!isFunctionNode(entry.node)) return;

									if (!IS_STYLE_FUNCTION_REGEX.test(entry.node.getName())) return;

									const args = entry.node.value;
									for (let i = 0; i < args.length; i++) {
										const arg = args[i];

										if (isWhiteSpaceOrCommentNode(arg)) continue;

										if (!isTokenNode(arg) || !isTokenIdent(arg.value) || !arg.value[4].value.startsWith('--')) break;

										if (!privatePropertyNames.has(arg.value[4].value)) break;

										mutateIdent(arg.value, `${prefix}${arg.value[4].value}`);
										break;
									}
								});

								nestedAtRule.params = stringify([componentValues]);
							});
						}

						// TODO:
						// substitute custom prop names in:
						// - if()
					});
				},
			};
		}
	};
};

creator.postcss = true;

export default creator;
export { creator as 'module.exports' };
