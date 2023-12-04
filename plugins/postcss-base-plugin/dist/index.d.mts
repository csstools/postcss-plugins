import { PluginCreator } from 'postcss';
/** postcss-base-plugin plugin options */
type pluginOptions = {
    /** Preserve the original notation. default: false */
    preserve?: boolean;
    /** Replacement color */
    color?: string;
};
declare const creator: PluginCreator<pluginOptions>;
export { creator as default, pluginOptions };
