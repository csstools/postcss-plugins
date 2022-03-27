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

			return {
				AtRule: {
					'design-tokens': async (atRule, { result }) => {
						if (!atRule?.source?.input?.file) {
							return;
						}
						const importResult = await tokensFromImport(variants, atRule.source.input.file, atRule.params);
						if (!importResult) {
							atRule.remove();
							return;
						}

						result.messages.push({
							type: 'dependency',
							plugin: 'postcss-design-tokens',
							file: importResult.filePath,
							parent: atRule.source.input.file,
						});

						tokens = mergeTokens(tokens, importResult.tokens);
					},
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

