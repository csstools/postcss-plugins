import type { PluginCreator } from 'postcss';

declare const creator: PluginCreator<pluginOptions>;
export default creator;

/** postcss-slow-plugins plugin options */
export declare type pluginOptions = {
    /** Plugins to ignore when reporting the results */
    ignore?: Array<string>;
};

export { }
