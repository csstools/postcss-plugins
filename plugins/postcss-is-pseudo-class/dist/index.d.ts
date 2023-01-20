import type { PluginCreator } from 'postcss';
type pluginOptions = {
    preserve?: boolean;
    onComplexSelector?: 'warning';
    onPseudoElement?: 'warning';
    specificityMatchingName?: string;
};
declare const creator: PluginCreator<pluginOptions>;
export default creator;
