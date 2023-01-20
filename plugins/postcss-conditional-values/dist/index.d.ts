import { PluginCreator } from 'postcss';
type pluginOptions = {
    functionName: string;
};
declare const creator: PluginCreator<pluginOptions>;
export default creator;
