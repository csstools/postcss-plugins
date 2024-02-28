import type { PluginCreator } from 'postcss';
import ampersandToScope from './lib/ampersand-to-scope.js';
import walk from './lib/walk.js';

/** postcss-nesting plugin options */
export type pluginOptions = {
	/** This option was removed. You must migrate your CSS to the latest speciation to continue using this plugin. */
	noIsPseudoSelector?: boolean,
};

const creator: PluginCreator<pluginOptions> = (opts?: pluginOptions) => {
	const options = Object.assign(
		// Default options
		{
			noIsPseudoSelector: false,
		},
		// Provided options
		opts,
	);

	if (options.noIsPseudoSelector) {
		throw new Error('The `noIsPseudoSelector` option is no longer supported. Migrate your CSS to use the latest CSS nesting syntax.');
	}

	return {
		postcssPlugin: 'postcss-nesting',
		Rule(rule, { result }) {
			walk(rule, result);

			if (rule.selector.includes('&')) {
				ampersandToScope(rule, result);
			}
		},
		AtRule: {
			nest(rule) {
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
