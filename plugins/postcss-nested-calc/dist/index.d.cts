import { PluginCreator } from 'postcss';
/** postcss-nested-calc plugin options */
type pluginOptions = {
    /** Preserve the original notation. default: true */
    preserve?: boolean;
};
declare const creator: PluginCreator<pluginOptions>;
export type { pluginOptions };
export = creator;
