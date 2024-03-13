import type { PluginCreator } from 'postcss';

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
