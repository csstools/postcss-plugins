import { PluginCreator } from 'postcss';
declare type pluginOptions = {
    dist?: string;
};
declare const creator: PluginCreator<pluginOptions>;
export default creator;
