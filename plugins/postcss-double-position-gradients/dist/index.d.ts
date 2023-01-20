import type { PluginCreator } from 'postcss';
type pluginOptions = {
    preserve?: boolean;
    enableProgressiveCustomProperties?: boolean;
};
declare const postcssPlugin: PluginCreator<pluginOptions>;
export default postcssPlugin;
