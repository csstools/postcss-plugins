import { PluginCreator } from 'postcss';
/** postcss-color-hex-alpha plugin options */
type pluginOptions = {
    /** Preserve the original notation. default: false */
    preserve?: boolean;
};
declare const creator: PluginCreator<pluginOptions>;
export { creator as default, pluginOptions };
