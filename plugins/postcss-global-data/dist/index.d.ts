import type { PluginCreator } from 'postcss';
/** postcss-global-data plugin options */
export type pluginOptions = {
    /** List of files to be used as context */
    files?: Array<string>;
};
declare const creator: PluginCreator<pluginOptions>;
export default creator;
