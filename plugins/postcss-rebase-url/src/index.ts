import type { PluginCreator, Declaration, AtRule } from 'postcss';
import { TokenType, tokenize } from '@csstools/css-tokenizer';
import { isCommentNode, isFunctionNode, isTokenNode, isWhitespaceNode, parseCommaSeparatedListOfComponentValues, replaceComponentValues, stringify } from '@csstools/css-parser-algorithms';
import { rebase } from './rebase';
import { serializeString } from './serialize-string';
import { normalizedDir } from './normalized-dir';

/** postcss-rebase-url plugin options */
export type pluginOptions = never;

const INITIAL_VALUE_PROPERTY = /initial-value/i;
const PROPERTY_NAME = /property/i;
const SYNTAX_PROPERTY = /syntax/i;
const URL_FUNCTION_CALL = /url\(/i;
const URL_FUNCTION_NAME = /url/i;
const URL_SYNTAX = /<url>/i;

const creator: PluginCreator<pluginOptions> = () => {
	return {
		postcssPlugin: 'postcss-rebase-url',
		prepare() {
			const visited = new WeakSet();
			const registeredPropsWithURL_Type = new Set();

			return {
				Once(root) {
					root.walkAtRules(PROPERTY_NAME, (atRule) => {
						if (!atRule.nodes) {
							return;
						}

						const syntaxDescriptor = atRule.nodes.find((x) => {
							if (x.type === 'decl' && SYNTAX_PROPERTY.test(x.prop)) {
								return true;
							}
						}) as Declaration | undefined;

						if (!syntaxDescriptor) {
							return;
						}

						if (URL_SYNTAX.test(syntaxDescriptor.value)) {
							registeredPropsWithURL_Type.add(atRule.params.trim());
						}
					});
				},
				Declaration(decl, { result }) {
					if (visited.has(decl)) {
						return;
					}

					if (decl.variable && !registeredPropsWithURL_Type.has(decl.prop)) {
						return;
					}

					if (
						INITIAL_VALUE_PROPERTY.test(decl.prop) &&
						decl.parent?.type === 'atrule' &&
						PROPERTY_NAME.test((decl.parent as AtRule).name)
					) {
						return;
					}

					const { from: fromEntryPoint } = result.opts;
					if (!fromEntryPoint) {
						return;
					}

					if (!decl.source?.input.from) {
						return;
					}

					if (!URL_FUNCTION_CALL.test(decl.value)) {
						return;
					}

					const fromEntryPointDir = normalizedDir(fromEntryPoint);

					const from = decl.source.input.from.trim();
					if (!from) {
						return;
					}

					const fromDir = normalizedDir(from);

					const componentValuesList = parseCommaSeparatedListOfComponentValues(tokenize({ css: decl.value }));
					const modifiedComponentValuesList = replaceComponentValues(
						componentValuesList,
						(componentValue) => {
							if (
								isTokenNode(componentValue) &&
								componentValue.value[0] === TokenType.URL
							) {
								const rebased = rebase(componentValue.value[4].value.trim(), fromDir, fromEntryPointDir);
								if (rebased) {
									componentValue.value[4].value = rebased;

									// Files with quotes
									componentValue.value[1] = `url(${serializeString(rebased)})`;
									return componentValue;
								}
							}

							if (
								isFunctionNode(componentValue) &&
								URL_FUNCTION_NAME.test(componentValue.getName())
							) {
								for (const x of componentValue.value) {
									if (isWhitespaceNode(x) || isCommentNode(x)) {
										continue;
									}

									if (isTokenNode(x) && x.value[0] === TokenType.String) {
										const rebased = rebase(x.value[4].value.trim(), fromDir, fromEntryPointDir);
										if (rebased) {
											x.value[4].value = rebased;
											x.value[1] = `"${serializeString(rebased)}"`;
											return componentValue;
										}

										break;
									}
								}
							}
						},
					);

					const modifiedValue = stringify(modifiedComponentValuesList);
					if (modifiedValue !== decl.value) {
						decl.value = modifiedValue;
						visited.add(decl);
					}
				},
			};
		},
	};
};

creator.postcss = true;

export default creator;
