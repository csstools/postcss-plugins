import type { PluginCreator } from 'postcss';
import ampersandToScope from './lib/ampersand-to-scope.js';
import walk from './lib/walk.js';

/** postcss-nesting plugin options */
export type pluginOptions = {
	/** @deprecated This option was removed. You must migrate your CSS to the latest speciation to continue using this plugin. */
	noIsPseudoSelector?: boolean,
};

const creator: PluginCreator<pluginOptions> = () => {
	return {
		postcssPlugin: 'postcss-nesting',
		Rule(rule, { result }): void {
			walk(rule, result);

			if (rule.selector.includes('&')) {
				ampersandToScope(rule, result);
			}
		},
		AtRule: {
			nest(rule): void {
				throw rule.error(
					'`@nest` was removed from the CSS Nesting specification and will be removed from PostCSS Nesting in the next major version.\n' +
					`Change \`@nest ${rule.params} {}\` to \`${rule.params} {}\` to migrate to the latest standard.`,
				);
			},
		},
	};
};

creator.postcss = true;

export default creator;
