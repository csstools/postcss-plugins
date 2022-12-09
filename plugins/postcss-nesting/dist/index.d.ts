import type { PluginCreator } from 'postcss';
type pluginOptions = {
    noIsPseudoSelector?: boolean;
};
declare const creator: PluginCreator<pluginOptions>;
export default creator;
