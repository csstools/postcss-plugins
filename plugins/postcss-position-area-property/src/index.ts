import type { PluginCreator } from 'postcss';

/** postcss-position-area-property plugin options */
export type pluginOptions = never;

const POSITION_AREA_REGEX = /^position-area$/i;

const creator: PluginCreator<pluginOptions> = () => {
	return {
		postcssPlugin: 'postcss-position-area-property',
		Declaration(decl): void {
			if (!POSITION_AREA_REGEX.test(decl.prop)) {
				return;
			}

			decl.cloneBefore({
				prop: 'inset-area',
				value: decl.value,
			});
		},
	};
};

creator.postcss = true;

export default creator;
export { creator as 'module.exports' };
