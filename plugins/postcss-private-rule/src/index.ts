import type { Plugin, PluginCreator } from 'postcss';
import { createPrivatePropertyTranspiler } from '@csstools/utilities-for-private-properties';

/** postcss-private-rule plugin options */
export type pluginOptions = never;

const creator: PluginCreator<pluginOptions> = () => {
	return {
		postcssPlugin: 'postcss-private-rule',
		prepare(): Plugin {
			const transpiler = createPrivatePropertyTranspiler();

			return {
				postcssPlugin: 'postcss-private-rule',
				Once(root): void {
					root.append(transpiler.transpile(root.nodes));
				},
			};
		},
	};
};

creator.postcss = true;

export default creator;
export { creator as 'module.exports' };
