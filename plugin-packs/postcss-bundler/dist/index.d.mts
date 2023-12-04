import { PluginCreator } from 'postcss';
/** postcss-bundler plugin options */
type pluginOptions = never;
declare const creator: PluginCreator<pluginOptions>;
export { creator as default, pluginOptions };
