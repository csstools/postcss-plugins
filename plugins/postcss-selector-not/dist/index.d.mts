import { PluginCreator } from 'postcss';
/** postcss-selector-not plugin options */
type pluginOptions = Record<string, never>;
declare const creator: PluginCreator<pluginOptions>;
export { creator as default, pluginOptions };
