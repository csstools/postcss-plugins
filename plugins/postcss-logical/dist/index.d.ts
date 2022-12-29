import type { PluginCreator } from 'postcss';
import { DirectionFlow } from './lib/types';
/** postcss-overflow-shorthand plugin options */
export type pluginOptions = {
    /** Preserve the original notation. default: false */
    preserve?: boolean;
    blockDirection?: DirectionFlow;
    inlineDirection?: DirectionFlow;
};
declare const creator: PluginCreator<pluginOptions>;
export default creator;
