import type { Node, PluginCreator } from 'postcss';
import { Token } from './data-formats/base/token';
import { tokensFromImport } from './data-formats/parse-import';
import { mergeTokens } from './data-formats/token';
import { parsePluginOptions, pluginOptions } from './options';
import { onCSSValue } from './values';

const creator: PluginCreator<pluginOptions> = (opts?: pluginOptions) => {
	const options = parsePluginOptions(opts);

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
					root.walkAtRules((atRule) => {
						if (atRule.name.toLowerCase() !== options.importAtRuleName) {
							return;
						}

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
							importResult = await tokensFromImport(options.is, atRule.filePath, atRule.params, importedFiles);
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
					if (!decl.value.toLowerCase().includes(options.valueFunctionName)) {
						return;
					}

					const modifiedValue = onCSSValue(tokens, result, decl, options);
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

