import type { PluginCreator } from 'postcss';

const creator: PluginCreator<unknown> = () => {
	return {
		postcssPlugin: 'css-has-pseudo-experimental',
		Once(root, { result }): void {
			root.warn(result, '"@csstools/css-has-pseudo-experimental" is no longer supported. Please use "css-has-pseudo" instead.');
		},
	};
};

creator.postcss = true;

export default creator;
export { creator as 'module.exports' };
