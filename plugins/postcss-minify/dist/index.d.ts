import type { PluginCreator } from 'postcss';

declare const creator: PluginCreator<pluginOptions>;
export default creator;

/** postcss-minify plugin options */
export declare type pluginOptions = never;

export { }
