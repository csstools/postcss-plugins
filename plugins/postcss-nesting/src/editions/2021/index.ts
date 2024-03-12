import type { PluginCreator } from 'postcss';
import ampersandToScope from './lib/ampersand-to-scope.js';
import walk from './lib/walk.js';

/** postcss-nesting plugin options */
export type pluginOptions = {
	/** Avoid the `:is()` pseudo class as much as possible. default: false */
	noIsPseudoSelector?: boolean,
	/** Silence the `@nest` warning. */
	silenceAtNestWarning?: boolean,
};

const creator: PluginCreator<pluginOptions> = (opts?: pluginOptions) => {
	const options = Object.assign(
		// Default options
		{
			noIsPseudoSelector: false,
			silenceAtNestWarning: false,
		},
		// Provided options
		opts,
	);

	return {
		postcssPlugin: 'postcss-nesting',
		Rule(rule, { result }): void {
			walk(rule, result, options);

			if (rule.selector.includes('&')) {
				ampersandToScope(rule, result);
			}
		},
	};
};

creator.postcss = true;

export default creator;
