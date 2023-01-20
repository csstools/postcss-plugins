import type { PluginCreator } from 'postcss';
type pluginOptions = {
    color?: string;
    preserve?: boolean;
};
declare const creator: PluginCreator<pluginOptions>;
export default creator;
