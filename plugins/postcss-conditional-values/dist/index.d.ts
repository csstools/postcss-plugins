import type { PluginCreator } from 'postcss';

declare const creator: PluginCreator<pluginOptions>;
export default creator;

export declare type pluginOptions = {
    functionName: string;
};

export { }
