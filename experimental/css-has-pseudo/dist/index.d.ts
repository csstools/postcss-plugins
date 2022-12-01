import type { PluginCreator } from 'postcss';
declare const creator: PluginCreator<{
    preserve?: boolean;
    specificityMatchingName?: string;
}>;
export default creator;
