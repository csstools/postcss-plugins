import { PluginCreator } from 'postcss';
/** postcss-minify plugin options */
type pluginOptions = never;
declare const creator: PluginCreator<pluginOptions>;
export type { pluginOptions };
export = creator;
