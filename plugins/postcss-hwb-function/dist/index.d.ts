import type { PluginCreator } from 'postcss';

/** postcss-hwb-function plugin options */
export declare type pluginOptions = {
    /** Preserve the original notation. default: false */
    preserve?: boolean;
};

/** Transform hwb() functions in CSS. */
declare const postcssPlugin: PluginCreator<pluginOptions>;
export default postcssPlugin;

export { }
