import { PluginCreator } from 'postcss';
/** css-blank-pseudo plugin options */
type pluginOptions = {
    /** Preserve the original notation. default: true */
    preserve?: boolean;
    /** Replacement for ":blank". default: "[blank]" */
    replaceWith?: string;
    /** Do not inject "js-blank-pseudo" before each selector with "[blank]". default: false */
    disablePolyfillReadyClass?: boolean;
};
declare const creator: PluginCreator<pluginOptions>;
export type { pluginOptions };
export = creator;
