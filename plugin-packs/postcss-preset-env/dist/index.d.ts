import type autoprefixer from 'autoprefixer';
import type { PluginCreator } from 'postcss';
import type { pluginOptions as pluginOptions_10 } from 'postcss-color-functional-notation';
import type { pluginOptions as pluginOptions_11 } from '@csstools/postcss-color-mix-function';
import type { pluginOptions as pluginOptions_12 } from 'postcss-custom-media';
import type { pluginOptions as pluginOptions_13 } from 'postcss-custom-properties';
import type { pluginOptions as pluginOptions_14 } from 'postcss-custom-selectors';
import type { pluginOptions as pluginOptions_15 } from 'postcss-dir-pseudo-class';
import type { pluginOptions as pluginOptions_16 } from '@csstools/postcss-normalize-display-values';
import type { pluginOptions as pluginOptions_17 } from 'postcss-double-position-gradients';
import type { pluginOptions as pluginOptions_18 } from '@csstools/postcss-exponential-functions';
import type { pluginOptions as pluginOptions_19 } from '@csstools/postcss-logical-float-and-clear';
import type { pluginOptions as pluginOptions_2 } from '@csstools/postcss-initial';
import type { pluginOptions as pluginOptions_20 } from 'postcss-focus-visible';
import type { pluginOptions as pluginOptions_21 } from 'postcss-focus-within';
import type { pluginOptions as pluginOptions_22 } from '@csstools/postcss-font-format-keywords';
import type { pluginOptions as pluginOptions_24 } from '@csstools/postcss-gamut-mapping';
import type { pluginOptions as pluginOptions_25 } from 'postcss-gap-properties';
import type { pluginOptions as pluginOptions_26 } from '@csstools/postcss-gradients-interpolation-method';
import type { pluginOptions as pluginOptions_27 } from 'css-has-pseudo';
import type { pluginOptions as pluginOptions_28 } from 'postcss-color-hex-alpha';
import type { pluginOptions as pluginOptions_29 } from '@csstools/postcss-hwb-function';
import type { pluginOptions as pluginOptions_3 } from 'postcss-pseudo-class-any-link';
import type { pluginOptions as pluginOptions_30 } from '@csstools/postcss-ic-unit';
import type { pluginOptions as pluginOptions_31 } from 'postcss-image-set-function';
import type { pluginOptions as pluginOptions_32 } from '@csstools/postcss-is-pseudo-class';
import type { pluginOptions as pluginOptions_33 } from 'postcss-lab-function';
import type { pluginOptions as pluginOptions_34 } from '@csstools/postcss-logical-overflow';
import type { pluginOptions as pluginOptions_35 } from '@csstools/postcss-logical-overscroll-behavior';
import type { pluginOptions as pluginOptions_36 } from 'postcss-logical';
import type { pluginOptions as pluginOptions_37 } from '@csstools/postcss-logical-resize';
import type { pluginOptions as pluginOptions_38 } from '@csstools/postcss-logical-viewport-units';
import type { pluginOptions as pluginOptions_39 } from '@csstools/postcss-media-queries-aspect-ratio-number-values';
import type { pluginOptions as pluginOptions_4 } from 'css-blank-pseudo';
import type { pluginOptions as pluginOptions_40 } from '@csstools/postcss-media-minmax';
import type { pluginOptions as pluginOptions_41 } from '@csstools/postcss-nested-calc';
import type { pluginOptions as pluginOptions_42 } from 'postcss-nesting';
import type { pluginOptions as pluginOptions_43 } from 'postcss-selector-not';
import type { pluginOptions as pluginOptions_44 } from '@csstools/postcss-oklab-function';
import type { pluginOptions as pluginOptions_46 } from 'postcss-overflow-shorthand';
import type { pluginOptions as pluginOptions_48 } from 'postcss-place';
import type { pluginOptions as pluginOptions_49 } from 'css-prefers-color-scheme';
import type { pluginOptions as pluginOptions_50 } from 'postcss-color-rebeccapurple';
import type { pluginOptions as pluginOptions_51 } from '@csstools/postcss-relative-color-syntax';
import type { pluginOptions as pluginOptions_52 } from '@csstools/postcss-scope-pseudo-class';
import type { pluginOptions as pluginOptions_53 } from '@csstools/postcss-stepped-value-functions';
import type { pluginOptions as pluginOptions_55 } from '@csstools/postcss-text-decoration-shorthand';
import type { pluginOptions as pluginOptions_56 } from '@csstools/postcss-trigonometric-functions';
import type { pluginOptions as pluginOptions_57 } from '@csstools/postcss-unset-value';
import type { pluginOptions as pluginOptions_6 } from '@csstools/postcss-cascade-layers';
import type { pluginOptions as pluginOptions_7 } from 'postcss-attribute-case-insensitive';
import type { pluginOptions as pluginOptions_9 } from '@csstools/postcss-color-function';

declare const creator: PluginCreator<pluginOptions>;
export default creator;

declare enum DirectionFlow {
    TopToBottom = "top-to-bottom",
    BottomToTop = "bottom-to-top",
    RightToLeft = "right-to-left",
    LeftToRight = "left-to-right"
}

export declare type pluginOptions = {
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

/** postcss-font-variant plugin options */
declare type pluginOptions_23 = Record<string, never>;

/** postcss-opacity-percentage plugin options */
declare type pluginOptions_45 = {
    /** Preserve the original notation. default: false */
    preserve?: boolean;
};

/** postcss-replace-overflow-wrap plugin options */
declare type pluginOptions_47 = {
    /** Preserve the original notation. default: false */
    preserve?: boolean;
};

/** postcss-page-break plugin options */
declare type pluginOptions_5 = Record<string, never>;

/** postcss-system-ui-font-family plugin options */
declare type pluginOptions_54 = Record<string, never>;

/** postcss-clamp plugin options */
declare type pluginOptions_8 = {
    /** Preserve the original notation. default: false */
    preserve?: boolean;
    /**
     * The precalculate option determines whether values with the same unit should be precalculated.
     * default: false
     */
    precalculate?: boolean;
};

declare type pluginsOptions = {
    /** plugin options for "@csstools/postcss-initial" */
    'all-property'?: pluginOptions_2 | boolean;
    /** plugin options for "postcss-pseudo-class-any-link" */
    'any-link-pseudo-class'?: pluginOptions_3 | boolean;
    /** plugin options for "css-blank-pseudo" */
    'blank-pseudo-class'?: pluginOptions_4 | boolean;
    /** plugin options for "postcss-page-break" */
    'break-properties'?: pluginOptions_5 | boolean;
    /** plugin options for "@csstools/postcss-cascade-layers" */
    'cascade-layers'?: pluginOptions_6 | boolean;
    /** plugin options for "postcss-attribute-case-insensitive" */
    'case-insensitive-attributes'?: pluginOptions_7 | boolean;
    /** plugin options for "postcss-clamp" */
    'clamp'?: pluginOptions_8 | boolean;
    /** plugin options for "@csstools/postcss-color-function" */
    'color-function'?: pluginOptions_9 | boolean;
    /** plugin options for "postcss-color-functional-notation" */
    'color-functional-notation'?: pluginOptions_10 | boolean;
    /** plugin options for "@csstools/postcss-color-mix-function" */
    'color-mix'?: pluginOptions_11 | boolean;
    /** plugin options for "postcss-custom-media" */
    'custom-media-queries'?: pluginOptions_12 | boolean;
    /** plugin options for "postcss-custom-properties" */
    'custom-properties'?: pluginOptions_13 | boolean;
    /** plugin options for "postcss-custom-selectors" */
    'custom-selectors'?: pluginOptions_14 | boolean;
    /** plugin options for "postcss-dir-pseudo-class" */
    'dir-pseudo-class'?: pluginOptions_15 | boolean;
    /** plugin options for "@csstools/postcss-normalize-display-values" */
    'display-two-values'?: pluginOptions_16 | boolean;
    /** plugin options for "postcss-double-position-gradients" */
    'double-position-gradients'?: pluginOptions_17 | boolean;
    /** plugin options for "@csstools/postcss-exponential-functions" */
    'exponential-functions'?: pluginOptions_18 | boolean;
    /** plugin options for "@csstools/postcss-logical-float-and-clear" */
    'float-clear-logical-values'?: pluginOptions_19 | boolean;
    /** plugin options for "postcss-focus-visible" */
    'focus-visible-pseudo-class'?: pluginOptions_20 | boolean;
    /** plugin options for "postcss-focus-within" */
    'focus-within-pseudo-class'?: pluginOptions_21 | boolean;
    /** plugin options for "@csstools/postcss-font-format-keywords" */
    'font-format-keywords'?: pluginOptions_22 | boolean;
    /** plugin options for "postcss-font-variant" */
    'font-variant-property'?: pluginOptions_23 | boolean;
    /** plugin options for "@csstools/postcss-gamut-mapping" */
    'gamut-mapping'?: pluginOptions_24 | boolean;
    /** plugin options for "postcss-gap-properties" */
    'gap-properties'?: pluginOptions_25 | boolean;
    /** plugin options for "@csstools/postcss-gradients-interpolation-method" */
    'gradients-interpolation-method'?: pluginOptions_26 | boolean;
    /** plugin options for "css-has-pseudo" */
    'has-pseudo-class'?: pluginOptions_27 | boolean;
    /** plugin options for "postcss-color-hex-alpha" */
    'hexadecimal-alpha-notation'?: pluginOptions_28 | boolean;
    /** plugin options for "@csstools/postcss-hwb-function" */
    'hwb-function'?: pluginOptions_29 | boolean;
    /** plugin options for "@csstools/postcss-ic-unit" */
    'ic-unit'?: pluginOptions_30 | boolean;
    /** plugin options for "postcss-image-set-function" */
    'image-set-function'?: pluginOptions_31 | boolean;
    /** plugin options for "@csstools/postcss-is-pseudo-class" */
    'is-pseudo-class'?: pluginOptions_32 | boolean;
    /** plugin options for "postcss-lab-function" */
    'lab-function'?: pluginOptions_33 | boolean;
    /** plugin options for "@csstools/postcss-logical-overflow" */
    'logical-overflow'?: pluginOptions_34 | boolean;
    /** plugin options for "@csstools/postcss-logical-overscroll-behavior" */
    'logical-overscroll-behavior'?: pluginOptions_35 | boolean;
    /** plugin options for "postcss-logical" */
    'logical-properties-and-values'?: pluginOptions_36 | boolean;
    /** plugin options for "@csstools/postcss-logical-resize" */
    'logical-resize'?: pluginOptions_37 | boolean;
    /** plugin options for "@csstools/postcss-logical-viewport-units" */
    'logical-viewport-units'?: pluginOptions_38 | boolean;
    /** plugin options for "@csstools/postcss-media-queries-aspect-ratio-number-values" */
    'media-queries-aspect-ratio-number-values'?: pluginOptions_39 | boolean;
    /** plugin options for "@csstools/postcss-media-minmax" */
    'media-query-ranges'?: pluginOptions_40 | boolean;
    /** plugin options for "@csstools/postcss-nested-calc" */
    'nested-calc'?: pluginOptions_41 | boolean;
    /** plugin options for "postcss-nesting" */
    'nesting-rules'?: pluginOptions_42 | boolean;
    /** plugin options for "postcss-selector-not" */
    'not-pseudo-class'?: pluginOptions_43 | boolean;
    /** plugin options for "@csstools/postcss-oklab-function" */
    'oklab-function'?: pluginOptions_44 | boolean;
    /** plugin options for "postcss-opacity-percentage" */
    'opacity-percentage'?: pluginOptions_45 | boolean;
    /** plugin options for "postcss-overflow-shorthand" */
    'overflow-property'?: pluginOptions_46 | boolean;
    /** plugin options for "postcss-replace-overflow-wrap" */
    'overflow-wrap-property'?: pluginOptions_47 | boolean;
    /** plugin options for "postcss-place" */
    'place-properties'?: pluginOptions_48 | boolean;
    /** plugin options for "css-prefers-color-scheme" */
    'prefers-color-scheme-query'?: pluginOptions_49 | boolean;
    /** plugin options for "postcss-color-rebeccapurple" */
    'rebeccapurple-color'?: pluginOptions_50 | boolean;
    /** plugin options for "@csstools/postcss-relative-color-syntax" */
    'relative-color-syntax'?: pluginOptions_51 | boolean;
    /** plugin options for "@csstools/postcss-scope-pseudo-class" */
    'scope-pseudo-class'?: pluginOptions_52 | boolean;
    /** plugin options for "@csstools/postcss-stepped-value-functions" */
    'stepped-value-functions'?: pluginOptions_53 | boolean;
    /** plugin options for "postcss-system-ui-font-family" */
    'system-ui-font-family'?: pluginOptions_54 | boolean;
    /** plugin options for "@csstools/postcss-text-decoration-shorthand" */
    'text-decoration-shorthand'?: pluginOptions_55 | boolean;
    /** plugin options for "@csstools/postcss-trigonometric-functions" */
    'trigonometric-functions'?: pluginOptions_56 | boolean;
    /** plugin options for "@csstools/postcss-unset-value" */
    'unset-value'?: pluginOptions_57 | boolean;
};

export { }
