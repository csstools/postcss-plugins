import { PluginCreator } from 'postcss';
export declare type pluginOptions = {
    functionName: string;
};
declare const creator: PluginCreator<pluginOptions>;
export default creator;
