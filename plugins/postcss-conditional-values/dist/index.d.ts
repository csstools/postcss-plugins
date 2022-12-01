import { PluginCreator } from 'postcss';
declare type pluginOptions = {
    functionName: string;
};
declare const creator: PluginCreator<pluginOptions>;
export default creator;
