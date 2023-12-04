import { PluginCreator } from 'postcss';
/** postcss-color-functional-notation plugin options */
type pluginOptions = {
    /** Preserve the original notation. default: false */
    preserve?: boolean;
    /** Enable "@csstools/postcss-progressive-custom-properties". default: true */
    enableProgressiveCustomProperties?: boolean;
};
declare const creator: PluginCreator<pluginOptions>;
export { creator as default, pluginOptions };
