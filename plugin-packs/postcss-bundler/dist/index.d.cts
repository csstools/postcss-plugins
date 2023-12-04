import { PluginCreator } from 'postcss';
/** postcss-bundler plugin options */
type pluginOptions = never;
declare const creator: PluginCreator<pluginOptions>;
export type { pluginOptions };
export = creator;
