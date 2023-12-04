import { PluginCreator } from 'postcss';
/** postcss-pseudo-class-any-link plugin options */
type pluginOptions = {
    /** Preserve the original notation. default: true */
    preserve?: boolean;
    /** Add an extra fallback for the "<area>" element in IE and Edge. default: false */
    subFeatures?: {
        areaHrefNeedsFixing?: boolean;
    };
};
declare const creator: PluginCreator<pluginOptions>;
export { creator as default, pluginOptions };
