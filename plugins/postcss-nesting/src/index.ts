import type { PluginCreator } from 'postcss';
import walk from './lib/walk.js';

/** postcss-nesting plugin options */
export type pluginOptions = {
	/** Avoid the `:is()` pseudo class as much as possible. default: false */
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

	return {
		postcssPlugin: 'postcss-nesting',
		Rule(rule, { result }) {
			walk(rule, result, options);
		},
	};
};

creator.postcss = true;

export default creator;
