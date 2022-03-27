import type { PluginCreator } from 'postcss';
import { Token } from './data-formats/base/token';
import { tokensFromImport } from './data-formats/parse-import';
import { mergeTokens } from './data-formats/token';
import { onCSSValue } from './values';

type pluginOptions = {
	variants?: Array<string>
}

const creator: PluginCreator<pluginOptions> = (opts?: pluginOptions) => {
	const variants = opts?.variants ?? [];
	if (variants.length === 0) {
		variants.push('default');
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
					const designTokenAtRules: Array<{filePath: string, params: string}> = [];
					root.walkAtRules('design-tokens', (atRule) => {
						if (!atRule?.source?.input?.file) {
							atRule.remove();
							return;
						}

						const filePath = atRule.source.input.file;
						const params = atRule.params;
						atRule.remove();

						designTokenAtRules.push({
							filePath: filePath,
							params: params,
						});
					});

					for (const atRule of designTokenAtRules.values()) {
						const importResult = await tokensFromImport(variants, atRule.filePath, atRule.params, importedFiles);
						if (!importResult) {
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

					const modifiedValue = onCSSValue(tokens, result, decl);
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

