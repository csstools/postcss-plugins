import type { Plugin, PluginCreator } from 'postcss';
import { findStyleRule, IS_PRIVATE_RULE_REGEX } from './valid-atrules';
import { Transpiler } from './transpiler';

/** postcss-private-rule plugin options */
export type pluginOptions = never;

const creator: PluginCreator<pluginOptions> = () => {
	return {
		postcssPlugin: 'postcss-private-rule',
		prepare(): Plugin {
			const transpiler = new Transpiler();

			return {
				postcssPlugin: 'postcss-private-rule',
				Once(root): void {
					root.walkAtRules(IS_PRIVATE_RULE_REGEX, (atRule) => {
						const styleRule = findStyleRule(atRule);
						if (!styleRule) {
							return;
						}

						transpiler.registerAndRemovePrivateRules(atRule, styleRule);
					});

					root.walkDecls((decl) => {
						transpiler.transpileDeclaration(decl);
					});

					root.walkAtRules((atRule) => {
						transpiler.transpileAtRule(atRule);
					});
				},
			};
		}
	};
};

creator.postcss = true;

export default creator;
export { creator as 'module.exports' };
