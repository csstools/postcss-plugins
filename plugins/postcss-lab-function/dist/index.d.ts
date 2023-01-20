import type { PluginCreator } from 'postcss';
type pluginOptions = {
    enableProgressiveCustomProperties?: boolean;
    preserve?: boolean;
    subFeatures?: {
        displayP3?: boolean;
    };
};
declare const postcssPlugin: PluginCreator<pluginOptions>;
export default postcssPlugin;
