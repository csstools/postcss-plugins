import type { PluginCreator } from 'postcss';

declare const creator: PluginCreator<pluginOptions>;
export default creator;
export { creator as 'module.exports' }

/** postcss-gamut-mapping plugin options */
export declare type pluginOptions = never;

export { }
