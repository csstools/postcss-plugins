import type { PluginCreator } from 'postcss';
/** postcss-prefers-color-scheme plugin options */
export declare type pluginOptions = {
    /** Preserve the original notation. default: true */
    preserve?: boolean;
};
declare const creator: PluginCreator<pluginOptions>;
export default creator;
