import { PluginCreator } from 'postcss';
/** css-has-pseudo plugin options */
type pluginOptions = {
    /** Preserve the original notation. default: true */
    preserve?: boolean;
    /** Change the selector that is used to adjust specificity. default: "does-not-exist" */
    specificityMatchingName?: string;
};
declare const creator: PluginCreator<pluginOptions>;
export type { pluginOptions };
export = creator;
