import type { PluginCreator } from 'postcss';
declare enum Direction {
    TopToBottom = "top-to-bottom",
    BottomToTop = "bottom-to-top",
    RightToLeft = "right-to-left",
    LeftToRight = "left-to-right"
}
/** postcss-overflow-shorthand plugin options */
export type pluginOptions = {
    /** Preserve the original notation. default: false */
    preserve?: boolean;
    blockDirection?: Direction;
    inlineDirection?: Direction;
};
declare const creator: PluginCreator<pluginOptions>;
export default creator;
