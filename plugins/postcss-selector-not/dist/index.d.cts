import { PluginCreator } from 'postcss';
/** postcss-selector-not plugin options */
type pluginOptions = Record<string, never>;
declare const creator: PluginCreator<pluginOptions>;
export type { pluginOptions };
export = creator;
