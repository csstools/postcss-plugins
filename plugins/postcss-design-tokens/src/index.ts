import type { Node, Plugin, PluginCreator } from 'postcss';
import type { Token } from './data-formats/base/token';
import { tokensFromImport } from './data-formats/parse-import';
import { mergeTokens } from './data-formats/token';
import type { pluginOptions } from './options';
import { parsePluginOptions } from './options';
export type { pluginOptions } from './options';
import { transform } from './transform';

const creator: PluginCreator<pluginOptions> = (opts?: pluginOptions) => {
	const options = parsePluginOptions(opts);

	return {
		postcssPlugin: 'postcss-design-tokens',
		prepare(): Plugin {
			let tokens = new Map<string, Token>();
			let importedFiles = new Set<string>();

			return {
				postcssPlugin: 'postcss-design-tokens',
				OnceExit(): void {
					tokens = new Map<string, Token>();
					importedFiles = new Set<string>();
				},
				async Once(root, postcssHelpers): Promise<void> {
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
							importResult = await tokensFromImport(root, postcssHelpers, options.is, atRule.filePath, atRule.params, importedFiles);
							if (!importResult) {
								continue;
							}
						} catch (err) {
							atRule.node.warn(postcssHelpers.result, `Failed to import design tokens from "${atRule.params}" with error:\n\t` + ((err instanceof Error) ? err.message : err));
							continue;
						}

						postcssHelpers.result.messages.push({
							type: 'dependency',
							plugin: 'postcss-design-tokens',
							file: importResult.filePath,
							parent: atRule.filePath,
						});

						tokens = mergeTokens(tokens, importResult.tokens);
					}
				},
				Declaration(decl, { result }): void {
					if (!decl.value.toLowerCase().includes(options.valueFunctionName)) {
						return;
					}

					try {
						const modifiedValue = transform(tokens, result, decl, decl.value, options);
						if (modifiedValue === decl.value) {
							return;
						}

						decl.value = modifiedValue;
					} catch {
						decl.warn(result, `Failed to parse and transform "${decl.value}"`);
					}
				},
				AtRule(atRule, { result }): void {
					if (!atRule.params.toLowerCase().includes(options.valueFunctionName)) {
						return;
					}

					try {
						const modifiedValue = transform(tokens, result, atRule, atRule.params, options);
						if (modifiedValue === atRule.params) {
							return;
						}

						atRule.params = modifiedValue;
					} catch {
						atRule.warn(result, `Failed to parse and transform "${atRule.params}"`);
					}
				},
			};
		},
	};
};

creator.postcss = true;

export default creator;
export { creator as 'module.exports' };

