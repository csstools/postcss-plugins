import { PluginCreator } from 'postcss';
/** postcss-hwb-function plugin options */
type pluginOptions = {
    /** Preserve the original notation. default: false */
    preserve?: boolean;
};
/** Transform hwb() functions in CSS. */
declare const creator: PluginCreator<pluginOptions>;
export { creator as default, pluginOptions };
