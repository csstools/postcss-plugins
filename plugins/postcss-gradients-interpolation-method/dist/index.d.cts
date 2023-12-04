import { PluginCreator } from 'postcss';
/** postcss-gradients-interpolation-method plugin options */
type pluginOptions = {
    /** Preserve the original notation. default: true */
    preserve?: boolean;
    /** Enable "@csstools/postcss-progressive-custom-properties". default: true */
    enableProgressiveCustomProperties?: boolean;
};
declare const creator: PluginCreator<pluginOptions>;
export type { pluginOptions };
export = creator;
