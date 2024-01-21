import type { PluginCreator } from 'postcss';

declare const creator: PluginCreator<pluginOptions>;
export default creator;

/** postcss-global-data plugin options */
export declare type pluginOptions = {
    /** List of files to be used as context */
    files?: Array<string>;
};

export { }
