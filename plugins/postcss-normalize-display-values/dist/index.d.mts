import { PluginCreator } from 'postcss';
/** postcss-normalize-display-values plugin options */
type pluginOptions = {
    /** Preserve the original notation. default: true */
    preserve?: boolean;
};
declare const creator: PluginCreator<pluginOptions>;
export { creator as default, pluginOptions };
