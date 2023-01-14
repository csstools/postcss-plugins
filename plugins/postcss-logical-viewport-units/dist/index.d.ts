import type { PluginCreator } from 'postcss';
/** postcss-logical-viewport-units plugin options */
export type pluginOptions = {
    /** Preserve the original notation. default: false */
    preserve?: boolean;
    /** Control how logical viewport units are replaced. default: "horizontal" */
    writingMode: 'horizontal' | 'vertical';
};
declare const creator: PluginCreator<pluginOptions>;
export default creator;
