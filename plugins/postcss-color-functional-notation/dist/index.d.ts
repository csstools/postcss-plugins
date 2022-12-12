import type { PluginCreator } from 'postcss';
/** postcss-color-functional-notation plugin options */
export type pluginOptions = {
    /** Preserve the original notation. default: false */
    preserve?: boolean;
};
/** Transform lab() and lch() functions in CSS. */
declare const postcssPlugin: PluginCreator<pluginOptions>;
export default postcssPlugin;
