import type { PluginCreator } from 'postcss';
import walk from './lib/walk.js';

const creator: PluginCreator<never> = () => {
	return {
		postcssPlugin: 'postcss-nesting',
		Rule(rule) {
			walk(rule);
		},
	};
};

creator.postcss = true;

export default creator;
