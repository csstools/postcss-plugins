import autoprefixer from "autoprefixer";
import { pluginOptions as postcssInitial } from "@csstools/postcss-initial";
import { pluginOptions as postcssPseudoClassAnyLink } from "postcss-pseudo-class-any-link";
import { pluginOptions as postcssBlankPseudo } from "css-blank-pseudo";
import { pluginOptions as postcssCascadeLayers } from "@csstools/postcss-cascade-layers";
import { pluginOptions as postcssAttributeCaseInsensitive } from "postcss-attribute-case-insensitive";
import { pluginOptions as postcssColorFunction } from "@csstools/postcss-color-function";
import { pluginOptions as postcssColorFunctionalNotation } from "postcss-color-functional-notation";
import { pluginOptions as postcssColorMixFunction } from "@csstools/postcss-color-mix-function";
import { pluginOptions as postcssCustomMedia } from "postcss-custom-media";
import { pluginOptions as postcssCustomProperties } from "postcss-custom-properties";
import { pluginOptions as postcssCustomSelectors } from "postcss-custom-selectors";
import { pluginOptions as postcssDirPseudoClass } from "postcss-dir-pseudo-class";
import { pluginOptions as postcssNormalizeDisplayValues } from "@csstools/postcss-normalize-display-values";
import { pluginOptions as postcssDoublePositionGradients } from "postcss-double-position-gradients";
import { pluginOptions as postcssExponentialFunctions } from "@csstools/postcss-exponential-functions";
import { pluginOptions as postcssLogicalFloatAndClear } from "@csstools/postcss-logical-float-and-clear";
import { pluginOptions as postcssFocusVisible } from "postcss-focus-visible";
import { pluginOptions as postcssFocusWithin } from "postcss-focus-within";
import { pluginOptions as postcssFontFormatKeywords } from "@csstools/postcss-font-format-keywords";
import { pluginOptions as postcssGamutMapping } from "@csstools/postcss-gamut-mapping";
import { pluginOptions as postcssGapProperties } from "postcss-gap-properties";
import { pluginOptions as postcssGradientsInterpolationMethod } from "@csstools/postcss-gradients-interpolation-method";
import { pluginOptions as postcssHasPseudo } from "css-has-pseudo";
import { pluginOptions as postcssColorHexAlpha } from "postcss-color-hex-alpha";
import { pluginOptions as postcssHWBFunction } from "@csstools/postcss-hwb-function";
import { pluginOptions as postcssICUnit } from "@csstools/postcss-ic-unit";
import { pluginOptions as postcssImageSetFunction } from "postcss-image-set-function";
import { pluginOptions as postcssIsPseudoClass } from "@csstools/postcss-is-pseudo-class";
import { pluginOptions as postcssLabFunction } from "postcss-lab-function";
import { pluginOptions as postcssLogicalOverflow } from "@csstools/postcss-logical-overflow";
import { pluginOptions as postcssLogicalOverscrollBehavor } from "@csstools/postcss-logical-overscroll-behavior";
import { pluginOptions as postcssLogical } from "postcss-logical";
import { pluginOptions as postcssLogicalResize } from "@csstools/postcss-logical-resize";
import { pluginOptions as postcssLogicalViewportUnits } from "@csstools/postcss-logical-viewport-units";
import { pluginOptions as postcssMediaQueriesAspectRatioNumberValues } from "@csstools/postcss-media-queries-aspect-ratio-number-values";
import { pluginOptions as postcssMediaMinmax } from "@csstools/postcss-media-minmax";
import { pluginOptions as postcssNestedCalc } from "@csstools/postcss-nested-calc";
import { pluginOptions as postcssNesting } from "postcss-nesting";
import { pluginOptions as postcssSelectorNot } from "postcss-selector-not";
import { pluginOptions as postcssOKLabFunction } from "@csstools/postcss-oklab-function";
import { pluginOptions as postcssOverflowShorthand } from "postcss-overflow-shorthand";
import { pluginOptions as postcssPlace } from "postcss-place";
import { pluginOptions as postcssPrefersColorScheme } from "css-prefers-color-scheme";
import { pluginOptions as postcssColorRebeccapurple } from "postcss-color-rebeccapurple";
import { pluginOptions as postcssRelativeColorSyntax } from "@csstools/postcss-relative-color-syntax";
import { pluginOptions as postcssScopePseudoClass } from "@csstools/postcss-scope-pseudo-class";
import { pluginOptions as postcssSteppedValueFunctions } from "@csstools/postcss-stepped-value-functions";
import { pluginOptions as postcssTextDecorationShorthand } from "@csstools/postcss-text-decoration-shorthand";
import { pluginOptions as postcssTrigonometricFunctions } from "@csstools/postcss-trigonometric-functions";
import { pluginOptions as postcssUnsetValue } from "@csstools/postcss-unset-value";
import { PluginCreator } from 'postcss';
/** postcss-page-break plugin options */
type pluginOptions = Record<string, never>;
type postcssPageBreak = pluginOptions;
/** postcss-clamp plugin options */
type pluginOptions$0 = {
    /** Preserve the original notation. default: false */
    preserve?: boolean;
    /**
     * The precalculate option determines whether values with the same unit should be precalculated.
     * default: false
     */
    precalculate?: boolean;
};
type postcssClamp = pluginOptions$0;
/** postcss-font-variant plugin options */
type pluginOptions$1 = Record<string, never>;
type postcssFontVariant = pluginOptions$1;
/** postcss-opacity-percentage plugin options */
type pluginOptions$2 = {
    /** Preserve the original notation. default: false */
    preserve?: boolean;
};
type postcssOpacityPercentage = pluginOptions$2;
/** postcss-replace-overflow-wrap plugin options */
type pluginOptions$3 = {
    /** Preserve the original notation. default: false */
    preserve?: boolean;
};
type postcssReplaceOverflowWrap = pluginOptions$3;
/** postcss-system-ui-font-family plugin options */
type pluginOptions$4 = Record<string, never>;
type postcssFontFamilySystemUI = pluginOptions$4;
type pluginsOptions = {
    /** plugin options for "@csstools/postcss-initial" */
    "all-property"?: postcssInitial | boolean;
    /** plugin options for "postcss-pseudo-class-any-link" */
    "any-link-pseudo-class"?: postcssPseudoClassAnyLink | boolean;
    /** plugin options for "css-blank-pseudo" */
    "blank-pseudo-class"?: postcssBlankPseudo | boolean;
    /** plugin options for "postcss-page-break" */
    "break-properties"?: postcssPageBreak | boolean;
    /** plugin options for "@csstools/postcss-cascade-layers" */
    "cascade-layers"?: postcssCascadeLayers | boolean;
    /** plugin options for "postcss-attribute-case-insensitive" */
    "case-insensitive-attributes"?: postcssAttributeCaseInsensitive | boolean;
    /** plugin options for "postcss-clamp" */
    "clamp"?: postcssClamp | boolean;
    /** plugin options for "@csstools/postcss-color-function" */
    "color-function"?: postcssColorFunction | boolean;
    /** plugin options for "postcss-color-functional-notation" */
    "color-functional-notation"?: postcssColorFunctionalNotation | boolean;
    /** plugin options for "@csstools/postcss-color-mix-function" */
    "color-mix"?: postcssColorMixFunction | boolean;
    /** plugin options for "postcss-custom-media" */
    "custom-media-queries"?: postcssCustomMedia | boolean;
    /** plugin options for "postcss-custom-properties" */
    "custom-properties"?: postcssCustomProperties | boolean;
    /** plugin options for "postcss-custom-selectors" */
    "custom-selectors"?: postcssCustomSelectors | boolean;
    /** plugin options for "postcss-dir-pseudo-class" */
    "dir-pseudo-class"?: postcssDirPseudoClass | boolean;
    /** plugin options for "@csstools/postcss-normalize-display-values" */
    "display-two-values"?: postcssNormalizeDisplayValues | boolean;
    /** plugin options for "postcss-double-position-gradients" */
    "double-position-gradients"?: postcssDoublePositionGradients | boolean;
    /** plugin options for "@csstools/postcss-exponential-functions" */
    "exponential-functions"?: postcssExponentialFunctions | boolean;
    /** plugin options for "@csstools/postcss-logical-float-and-clear" */
    "float-clear-logical-values"?: postcssLogicalFloatAndClear | boolean;
    /** plugin options for "postcss-focus-visible" */
    "focus-visible-pseudo-class"?: postcssFocusVisible | boolean;
    /** plugin options for "postcss-focus-within" */
    "focus-within-pseudo-class"?: postcssFocusWithin | boolean;
    /** plugin options for "@csstools/postcss-font-format-keywords" */
    "font-format-keywords"?: postcssFontFormatKeywords | boolean;
    /** plugin options for "postcss-font-variant" */
    "font-variant-property"?: postcssFontVariant | boolean;
    /** plugin options for "@csstools/postcss-gamut-mapping" */
    "gamut-mapping"?: postcssGamutMapping | boolean;
    /** plugin options for "postcss-gap-properties" */
    "gap-properties"?: postcssGapProperties | boolean;
    /** plugin options for "@csstools/postcss-gradients-interpolation-method" */
    "gradients-interpolation-method"?: postcssGradientsInterpolationMethod | boolean;
    /** plugin options for "css-has-pseudo" */
    "has-pseudo-class"?: postcssHasPseudo | boolean;
    /** plugin options for "postcss-color-hex-alpha" */
    "hexadecimal-alpha-notation"?: postcssColorHexAlpha | boolean;
    /** plugin options for "@csstools/postcss-hwb-function" */
    "hwb-function"?: postcssHWBFunction | boolean;
    /** plugin options for "@csstools/postcss-ic-unit" */
    "ic-unit"?: postcssICUnit | boolean;
    /** plugin options for "postcss-image-set-function" */
    "image-set-function"?: postcssImageSetFunction | boolean;
    /** plugin options for "@csstools/postcss-is-pseudo-class" */
    "is-pseudo-class"?: postcssIsPseudoClass | boolean;
    /** plugin options for "postcss-lab-function" */
    "lab-function"?: postcssLabFunction | boolean;
    /** plugin options for "@csstools/postcss-logical-overflow" */
    "logical-overflow"?: postcssLogicalOverflow | boolean;
    /** plugin options for "@csstools/postcss-logical-overscroll-behavior" */
    "logical-overscroll-behavior"?: postcssLogicalOverscrollBehavor | boolean;
    /** plugin options for "postcss-logical" */
    "logical-properties-and-values"?: postcssLogical | boolean;
    /** plugin options for "@csstools/postcss-logical-resize" */
    "logical-resize"?: postcssLogicalResize | boolean;
    /** plugin options for "@csstools/postcss-logical-viewport-units" */
    "logical-viewport-units"?: postcssLogicalViewportUnits | boolean;
    /** plugin options for "@csstools/postcss-media-queries-aspect-ratio-number-values" */
    "media-queries-aspect-ratio-number-values"?: postcssMediaQueriesAspectRatioNumberValues | boolean;
    /** plugin options for "@csstools/postcss-media-minmax" */
    "media-query-ranges"?: postcssMediaMinmax | boolean;
    /** plugin options for "@csstools/postcss-nested-calc" */
    "nested-calc"?: postcssNestedCalc | boolean;
    /** plugin options for "postcss-nesting" */
    "nesting-rules"?: postcssNesting | boolean;
    /** plugin options for "postcss-selector-not" */
    "not-pseudo-class"?: postcssSelectorNot | boolean;
    /** plugin options for "@csstools/postcss-oklab-function" */
    "oklab-function"?: postcssOKLabFunction | boolean;
    /** plugin options for "postcss-opacity-percentage" */
    "opacity-percentage"?: postcssOpacityPercentage | boolean;
    /** plugin options for "postcss-overflow-shorthand" */
    "overflow-property"?: postcssOverflowShorthand | boolean;
    /** plugin options for "postcss-replace-overflow-wrap" */
    "overflow-wrap-property"?: postcssReplaceOverflowWrap | boolean;
    /** plugin options for "postcss-place" */
    "place-properties"?: postcssPlace | boolean;
    /** plugin options for "css-prefers-color-scheme" */
    "prefers-color-scheme-query"?: postcssPrefersColorScheme | boolean;
    /** plugin options for "postcss-color-rebeccapurple" */
    "rebeccapurple-color"?: postcssColorRebeccapurple | boolean;
    /** plugin options for "@csstools/postcss-relative-color-syntax" */
    "relative-color-syntax"?: postcssRelativeColorSyntax | boolean;
    /** plugin options for "@csstools/postcss-scope-pseudo-class" */
    "scope-pseudo-class"?: postcssScopePseudoClass | boolean;
    /** plugin options for "@csstools/postcss-stepped-value-functions" */
    "stepped-value-functions"?: postcssSteppedValueFunctions | boolean;
    /** plugin options for "postcss-system-ui-font-family" */
    "system-ui-font-family"?: postcssFontFamilySystemUI | boolean;
    /** plugin options for "@csstools/postcss-text-decoration-shorthand" */
    "text-decoration-shorthand"?: postcssTextDecorationShorthand | boolean;
    /** plugin options for "@csstools/postcss-trigonometric-functions" */
    "trigonometric-functions"?: postcssTrigonometricFunctions | boolean;
    /** plugin options for "@csstools/postcss-unset-value" */
    "unset-value"?: postcssUnsetValue | boolean;
};
declare enum DirectionFlow {
    TopToBottom = "top-to-bottom",
    BottomToTop = "bottom-to-top",
    RightToLeft = "right-to-left",
    LeftToRight = "left-to-right"
}
type pluginOptions$5 = {
    /**
     * Determine which CSS features to polyfill,
     * based upon their process in becoming web standards.
     * default: 2
     */
    stage?: number | false;
    /**
     * Determine which CSS features to polyfill,
     * based their implementation status.
     * default: 0
     */
    minimumVendorImplementations?: number;
    /**
     * Enable any feature that would need an extra browser library to be loaded into the page for it to work.
     * default: false
     */
    enableClientSidePolyfills?: boolean;
    /**
     * PostCSS Preset Env supports any standard browserslist configuration,
     * which can be a `.browserslistrc` file,
     * a `browserslist` key in `package.json`,
     * or `browserslist` environment variables.
     *
     * The `env` option is used to select a specific browserslist environment in the event that you have more than one.
     */
    env?: string;
    /**
     * PostCSS Preset Env supports any standard browserslist configuration,
     * which can be a `.browserslistrc` file,
     * a `browserslist` key in `package.json`,
     * or `browserslist` environment variables.
     *
     * The `browsers` option should only be used when a standard browserslist configuration is not available.
     * When the `browsers` option is used the `env` option is ignored.
     */
    browsers?: string | Array<string> | null;
    /**
     * Determine whether all plugins should receive a `preserve` option,
     * which may preserve or remove the original and now polyfilled CSS.
     * Each plugin has it's own default, some true, others false.
     * default: _not set_
     */
    preserve?: boolean;
    /**
     * [Configure autoprefixer](https://github.com/postcss/autoprefixer#options)
     */
    autoprefixer?: autoprefixer.Options;
    /**
     * Enable or disable specific polyfills by ID.
     * Passing `true` to a specific [feature ID](https://github.com/csstools/postcss-plugins/blob/main/plugin-packs/postcss-preset-env/FEATURES.md) will enable its polyfill,
     * while passing `false` will disable it.
     *
     * Passing an object to a specific feature ID will both enable and configure it.
     */
    features?: pluginsOptions;
    /**
     * The `insertBefore` key allows you to insert other PostCSS plugins into the chain.
     * This is only useful if you are also using sugary PostCSS plugins that must execute before certain polyfills.
     * `insertBefore` supports chaining one or multiple plugins.
     */
    insertBefore?: Record<string, unknown>;
    /**
     * The `insertAfter` key allows you to insert other PostCSS plugins into the chain.
     * This is only useful if you are also using sugary PostCSS plugins that must execute after certain polyfills.
     * `insertAfter` supports chaining one or multiple plugins.
     */
    insertAfter?: Record<string, unknown>;
    /**
     * Enable debugging messages to stdout giving insights into which features have been enabled/disabled and why.
     * default: false
     */
    debug?: boolean;
    /**
     * The `logical` object allows to configure all plugins related to logical document flow at once.
     * It accepts the same options as each plugin: `inlineDirection` and `blockDirection`.
     */
    logical?: {
        /** Set the inline flow direction. default: left-to-right */
        inlineDirection?: DirectionFlow;
        /** Set the block flow direction. default: top-to-bottom */
        blockDirection?: DirectionFlow;
    };
};
declare const creator: PluginCreator<pluginOptions$5>;
export type { pluginOptions$5 as pluginOptions };
export = creator;
