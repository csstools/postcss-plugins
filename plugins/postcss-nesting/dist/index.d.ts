import type { PluginCreator } from 'postcss';
/** postcss-nesting plugin options */
export type pluginOptions = {
    /** Avoid the `:is()` pseudo class as much as possible. default: false */
    noIsPseudoSelector?: boolean;
};
declare const creator: PluginCreator<pluginOptions>;
export default creator;
