import { PluginCreator } from 'postcss';
/** postcss-slow-plugins plugin options */
type pluginOptions = {
    /** Plugins to ignore when reporting the results */
    ignore?: Array<string>;
};
declare const creator: PluginCreator<pluginOptions>;
export type { pluginOptions };
export = creator;
