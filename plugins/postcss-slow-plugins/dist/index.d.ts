import type { PluginCreator } from 'postcss';
/** postcss-slow-plugins plugin options */
export type pluginOptions = {
    /** Plugins to ignore when reporting the results */
    ignore?: Array<string>;
};
declare const creator: PluginCreator<pluginOptions>;
export default creator;
