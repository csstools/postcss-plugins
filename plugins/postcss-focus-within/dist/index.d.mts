import { PluginCreator } from 'postcss';
/** postcss-focus-within plugin options */
type pluginOptions = {
    /** Preserve the original notation. default: true */
    preserve?: boolean;
    /** The replacement class to be used in the polyfill. default: "[focus-within]" */
    replaceWith?: string;
    /** Disable the selector prefix that is used to prevent a flash of incorrectly styled content. default: false */
    disablePolyfillReadyClass?: boolean;
};
declare const creator: PluginCreator<pluginOptions>;
export { creator as default, pluginOptions };
