import { PluginCreator } from 'postcss';
declare enum DirectionFlow {
    TopToBottom = "top-to-bottom",
    BottomToTop = "bottom-to-top",
    RightToLeft = "right-to-left",
    LeftToRight = "left-to-right"
}
/** postcss-logical-viewport-units plugin options */
type pluginOptions = {
    /** Preserve the original notation. default: false */
    preserve?: boolean;
    /** Sets the direction for inline. default: left-to-right */
    inlineDirection?: DirectionFlow;
};
declare const creator: PluginCreator<pluginOptions>;
export type { pluginOptions };
export = creator;
