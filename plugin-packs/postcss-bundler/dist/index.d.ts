import type { PluginCreator } from 'postcss';

declare const creator: PluginCreator<pluginOptions>;
export default creator;

/** postcss-bundler plugin options */
export declare type pluginOptions = never;

export { }
