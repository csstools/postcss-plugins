import type { PluginCreator } from 'postcss';
type pluginOptions = {
    preserve?: boolean;
};
declare const creator: PluginCreator<pluginOptions>;
export default creator;
