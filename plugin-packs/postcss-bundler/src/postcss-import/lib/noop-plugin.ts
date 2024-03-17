import type { PluginCreator } from 'postcss';

// https://github.com/postcss/postcss/issues/1869
const noopPlugin: PluginCreator<never> = () => {
	return {
		postcssPlugin: 'noop-plugin',
		Once(): void {
			// do nothing
		},
	};
};

noopPlugin.postcss = true;

export default noopPlugin;
