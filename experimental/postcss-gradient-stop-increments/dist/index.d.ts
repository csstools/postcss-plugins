import type { PluginCreator } from 'postcss';
/** postcss-gradient-stop-increments plugin options */
export type pluginOptions = {
    /** Preserve the original notation. default: false */
    preserve?: boolean;
};
declare const creator: PluginCreator<pluginOptions>;
export default creator;
