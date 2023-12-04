import { PluginCreator } from 'postcss';
/** postcss-overflow-shorthand plugin options */
type pluginOptions = {
    /** Preserve the original notation. default: true */
    preserve?: boolean;
};
declare const creator: PluginCreator<pluginOptions>;
export { creator as default, pluginOptions };
