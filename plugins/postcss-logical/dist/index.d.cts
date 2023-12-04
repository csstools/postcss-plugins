import { PluginCreator } from 'postcss';
declare enum DirectionFlow {
    TopToBottom = "top-to-bottom",
    BottomToTop = "bottom-to-top",
    RightToLeft = "right-to-left",
    LeftToRight = "left-to-right"
}
/** postcss-logical plugin options */
type pluginOptions = {
    /** Sets the direction for block. default: top-to-bottom */
    blockDirection?: DirectionFlow;
    /** Sets the direction for inline. default: left-to-right */
    inlineDirection?: DirectionFlow;
};
declare const creator: PluginCreator<pluginOptions>;
export type { pluginOptions };
export = creator;
