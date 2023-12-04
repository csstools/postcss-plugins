import { PluginCreator } from 'postcss';
/** postcss-gradient-stop-increments plugin options */
type pluginOptions = {
    /** Preserve the original notation. default: false */
    preserve?: boolean;
};
declare const creator: PluginCreator<pluginOptions>;
export type { pluginOptions };
export = creator;
