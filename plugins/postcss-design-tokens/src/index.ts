import type { Node, PluginCreator } from 'postcss';
import { Token } from './data-formats/base/token';
import { tokensFromImport } from './data-formats/parse-import';
import { mergeTokens } from './data-formats/token';
import { pluginOptions } from './options';
import { onCSSValue } from './values';


const creator: PluginCreator<pluginOptions> = (opts?: pluginOptions) => {
	const buildIs = opts?.is ?? [];
	if (buildIs.length === 0) {
		buildIs.push('6b4e71e7-4787-42f7-a092-8684961895db'); // a random, but shared default condition
	}

	return {
		postcssPlugin: 'postcss-design-tokens',
		prepare() {
			let tokens = new Map<string, Token>();
			let importedFiles = new Set<string>();

			return {
				OnceExit() {
					tokens = new Map<string, Token>();
					importedFiles = new Set<string>();
				},
				Once: async (root, { result }) => {
					const designTokenAtRules: Array<{filePath: string, params: string, node: Node}> = [];
					root.walkAtRules('design-tokens', (atRule) => {
						if (!atRule?.source?.input?.file) {
							return;
						}

						const filePath = atRule.source.input.file;
						const params = atRule.params;
						atRule.remove();

						designTokenAtRules.push({
							filePath: filePath,
							params: params,
							node: atRule,
						});
					});

					for (const atRule of designTokenAtRules.values()) {
						let importResult: { filePath: string, tokens: Map<string, Token> }|false;
						try {
							importResult = await tokensFromImport(buildIs, atRule.filePath, atRule.params, importedFiles);
							if (!importResult) {
								continue;
							}
						} catch (e) {
							atRule.node.warn(result, `Failed to import design tokens from "${atRule.params}" with error:\n\t` + (e as Error).message);
							continue;
						}

						result.messages.push({
							type: 'dependency',
							plugin: 'postcss-design-tokens',
							file: importResult.filePath,
							parent: atRule.filePath,
						});

						tokens = mergeTokens(tokens, importResult.tokens);
					}
				},
				Declaration(decl, { result }) {
					if (decl.value.indexOf('design-token') === -1) {
						return;
					}

					const modifiedValue = onCSSValue(tokens, result, decl, opts);
					if (modifiedValue === decl.value) {
						return;
					}

					decl.value = modifiedValue;
				},
			};
		},
	};
};

creator.postcss = true;

export default creator;

