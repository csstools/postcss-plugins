import { PluginCreator } from 'postcss';
/** postcss-global-data plugin options */
type pluginOptions = {
    /** List of files to be used as context */
    files?: Array<string>;
};
declare const creator: PluginCreator<pluginOptions>;
export { creator as default, pluginOptions };
