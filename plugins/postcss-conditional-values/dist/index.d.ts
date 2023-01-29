import { PluginCreator } from 'postcss';
export type pluginOptions = {
    functionName: string;
};
declare const creator: PluginCreator<pluginOptions>;
export default creator;
