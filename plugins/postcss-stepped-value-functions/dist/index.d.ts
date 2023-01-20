import type { PluginCreator } from 'postcss';
export type pluginOptions = {
    preserve?: boolean;
    onInvalid?: string;
};
declare const creator: PluginCreator<pluginOptions>;
export default creator;
