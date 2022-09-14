import type { PluginCreator } from 'postcss';
import walk from './lib/walk.js';

type pluginOptions = { noIsPseudoSelector?: boolean };

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
		Rule(rule) {
			walk(rule, options);
		},
	};
};

creator.postcss = true;

export default creator;
