import type { PluginCreator } from 'postcss';

/** postcss-logical-viewport-units plugin options */
export declare type basePluginOptions = {
    /** Preserve the original notation. default: true */
    preserve: boolean;
    /** Sets the direction for inline. default: left-to-right */
    inlineDirection?: DirectionFlow;
};

export declare enum DirectionFlow {
    TopToBottom = "top-to-bottom",
    BottomToTop = "bottom-to-top",
    RightToLeft = "right-to-left",
    LeftToRight = "left-to-right"
}

/** postcss-logical-viewport-units plugin options */
export declare type pluginOptions = {
    /** Preserve the original notation. default: true */
    preserve?: boolean;
    /** Sets the direction for inline. default: left-to-right */
    inlineDirection?: DirectionFlow;
    /** Enable "@csstools/postcss-progressive-custom-properties". default: true */
    enableProgressiveCustomProperties?: boolean;
};

declare const postcssPlugin: PluginCreator<pluginOptions>;
export default postcssPlugin;
export { postcssPlugin as 'module.exports' }

export { }
