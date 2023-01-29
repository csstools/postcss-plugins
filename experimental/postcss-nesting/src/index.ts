import type { PluginCreator } from 'postcss';
import ampersandToScope from './lib/ampersand-to-scope.js';
import walk from './lib/walk.js';

const creator: PluginCreator<never> = () => {
	return {
		postcssPlugin: 'postcss-nesting',
		Rule(rule, { result }) {
			walk(rule, result);

			if (rule.selector.trim().includes('&')) {
				ampersandToScope(rule, result);
			}
		},
	};
};

creator.postcss = true;

export default creator;
