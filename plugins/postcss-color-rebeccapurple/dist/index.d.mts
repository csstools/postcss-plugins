import { PluginCreator } from 'postcss';
/** postcss-color-rebeccapurple plugin options */
type pluginOptions = {
    /** Preserve the original notation. default: false */
    preserve?: boolean;
};
declare const creator: PluginCreator<pluginOptions>;
export { creator as default, pluginOptions };
