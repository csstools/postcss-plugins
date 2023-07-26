import type { PluginCreator } from 'postcss';
import { posix as path } from 'path';
import { TokenType, tokenize } from '@csstools/css-tokenizer';
import { isCommentNode, isFunctionNode, isTokenNode, isWhitespaceNode, parseCommaSeparatedListOfComponentValues, replaceComponentValues, stringify } from '@csstools/css-parser-algorithms';
import { rebase } from './rebase';
import { serializeString } from './serialize-string';
import { toPosixPath } from './posix-path';

/** postcss-rebase-url plugin options */
export type pluginOptions = never;

const URL_FUNCTION_CALL = /url\(/i;
const URL_FUNCTION_NAME = /url/i;

const creator: PluginCreator<pluginOptions> = () => {
	return {
		postcssPlugin: 'postcss-rebase-url',
		prepare() {
			const visited = new WeakSet();

			return {
				Declaration(decl, { result }) {
					if (visited.has(decl)) {
						return;
					}

					const { from: fromEntryPoint, to } = result.opts;
					if (!to || !fromEntryPoint) {
						return;
					}

					const toDir = path.parse(path.resolve(toPosixPath(to))).dir;

					const from = decl.source?.input.from;
					if (!from) {
						return;
					}

					const fromDir = path.parse(path.resolve(toPosixPath(from))).dir;
					const fromEntryPointDir = path.parse(path.resolve(toPosixPath(fromEntryPoint))).dir;

					if (!URL_FUNCTION_CALL.test(decl.value)) {
						return;
					}

					const componentValuesList = parseCommaSeparatedListOfComponentValues(tokenize({ css: decl.value }));
					const modifiedComponentValuesList = replaceComponentValues(
						componentValuesList,
						(componentValue) => {
							if (
								isTokenNode(componentValue) &&
								componentValue.value[0] === TokenType.URL
							) {
								const rebased = rebase(componentValue.value[4].value, fromDir, fromEntryPointDir, toDir);
								if (rebased) {
									componentValue.value[4].value = rebased;

									// Files with quotes
									componentValue.value[1] = `url(./${serializeString(rebased)})`;
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
										const rebased = rebase(x.value[4].value, fromDir, fromEntryPointDir, toDir);
										if (rebased) {
											x.value[4].value = rebased;
											x.value[1] = `"./${serializeString(rebased)}"`;
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
