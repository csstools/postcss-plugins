import type { PluginCreator } from 'postcss';
/** postcss-trigonometric-functions plugin options */
export declare type pluginOptions = {
    /** Preserve the original notation. default: false */
    preserve?: boolean;
};
declare const creator: PluginCreator<pluginOptions>;
export default creator;
