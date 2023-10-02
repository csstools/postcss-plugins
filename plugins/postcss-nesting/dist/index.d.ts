import type { PluginCreator } from 'postcss';
/** postcss-nesting plugin options */
export type pluginOptions = {
    /** This option was removed. You must migrate your CSS to the latest speciation to continue using this plugin. */
    noIsPseudoSelector?: boolean;
};
declare const creator: PluginCreator<pluginOptions>;
export default creator;
