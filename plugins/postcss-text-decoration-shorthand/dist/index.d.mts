import { PluginCreator } from 'postcss';
/** postcss-text-decoration-shorthand plugin options */
type pluginOptions = {
    /** Preserve the original notation. default: true */
    preserve?: boolean;
};
declare const creator: PluginCreator<pluginOptions>;
export { creator as default, pluginOptions };
