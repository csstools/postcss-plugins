import type { PluginCreator } from 'postcss';
/** postcss-bundler plugin options */
export type pluginOptions = {
    /** plugin options for `@csstools/postcss-rebase-url` */
    rebaseURL: never;
    /** plugin options for `postcss-import` */
    import: never;
};
declare const creator: PluginCreator<pluginOptions>;
export default creator;
