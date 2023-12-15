import type { pluginOptions as postcssInitialOptions } from '@csstools/postcss-initial';
import type { pluginOptions as postcssPseudoClassAnyLinkOptions } from 'postcss-pseudo-class-any-link';
import type { pluginOptions as postcssBlankPseudoOptions } from 'css-blank-pseudo';
import type { postcssPageBreakOptions } from '../types/postcss-page-break/plugin-options';
import type { pluginOptions as postcssCascadeLayersOptions } from '@csstools/postcss-cascade-layers';
import type { pluginOptions as postcssAttributeCaseInsensitiveOptions } from 'postcss-attribute-case-insensitive';
import type { postcssClampOptions } from '../types/postcss-clamp/plugin-options';
import type { pluginOptions as postcssColorFunctionOptions } from '@csstools/postcss-color-function';
import type { pluginOptions as postcssColorFunctionalNotationOptions } from 'postcss-color-functional-notation';
import type { pluginOptions as postcssColorMixFunctionOptions } from '@csstools/postcss-color-mix-function';
import type { pluginOptions as postcssCustomMediaOptions } from 'postcss-custom-media';
import type { pluginOptions as postcssCustomPropertiesOptions } from 'postcss-custom-properties';
import type { pluginOptions as postcssCustomSelectorsOptions } from 'postcss-custom-selectors';
import type { pluginOptions as postcssDirPseudoClassOptions } from 'postcss-dir-pseudo-class';
import type { pluginOptions as postcssNormalizeDisplayValuesOptions } from '@csstools/postcss-normalize-display-values';
import type { pluginOptions as postcssDoublePositionGradientsOptions } from 'postcss-double-position-gradients';
import type { pluginOptions as postcssExponentialFunctionsOptions } from '@csstools/postcss-exponential-functions';
import type { pluginOptions as postcssLogicalFloatAndClearOptions } from '@csstools/postcss-logical-float-and-clear';
import type { pluginOptions as postcssFocusVisibleOptions } from 'postcss-focus-visible';
import type { pluginOptions as postcssFocusWithinOptions } from 'postcss-focus-within';
import type { pluginOptions as postcssFontFormatKeywordsOptions } from '@csstools/postcss-font-format-keywords';
import type { postcssFontVariantOptions } from '../types/postcss-font-variant/plugin-options';
import type { pluginOptions as postcssGamutMappingOptions } from '@csstools/postcss-gamut-mapping';
import type { pluginOptions as postcssGapPropertiesOptions } from 'postcss-gap-properties';
import type { pluginOptions as postcssGradientsInterpolationMethodOptions } from '@csstools/postcss-gradients-interpolation-method';
import type { pluginOptions as postcssHasPseudoOptions } from 'css-has-pseudo';
import type { pluginOptions as postcssColorHexAlphaOptions } from 'postcss-color-hex-alpha';
import type { pluginOptions as postcssHWBFunctionOptions } from '@csstools/postcss-hwb-function';
import type { pluginOptions as postcssICUnitOptions } from '@csstools/postcss-ic-unit';
import type { pluginOptions as postcssImageSetFunctionOptions } from 'postcss-image-set-function';
import type { pluginOptions as postcssIsPseudoClassOptions } from '@csstools/postcss-is-pseudo-class';
import type { pluginOptions as postcssLabFunctionOptions } from 'postcss-lab-function';
import type { pluginOptions as postcssLogicalOverflowOptions } from '@csstools/postcss-logical-overflow';
import type { pluginOptions as postcssLogicalOverscrollBehavorOptions } from '@csstools/postcss-logical-overscroll-behavior';
import type { pluginOptions as postcssLogicalOptions } from 'postcss-logical';
import type { pluginOptions as postcssLogicalResizeOptions } from '@csstools/postcss-logical-resize';
import type { pluginOptions as postcssLogicalViewportUnitsOptions } from '@csstools/postcss-logical-viewport-units';
import type { pluginOptions as postcssMediaQueriesAspectRatioNumberValuesOptions } from '@csstools/postcss-media-queries-aspect-ratio-number-values';
import type { pluginOptions as postcssMediaMinmaxOptions } from '@csstools/postcss-media-minmax';
import type { pluginOptions as postcssNestedCalcOptions } from '@csstools/postcss-nested-calc';
import type { pluginOptions as postcssNestingOptions } from 'postcss-nesting';
import type { pluginOptions as postcssSelectorNotOptions } from 'postcss-selector-not';
import type { pluginOptions as postcssOKLabFunctionOptions } from '@csstools/postcss-oklab-function';
import type { postcssOpacityPercentageOptions } from '../types/postcss-opacity-percentage/plugin-options';
import type { pluginOptions as postcssOverflowShorthandOptions } from 'postcss-overflow-shorthand';
import type { postcssReplaceOverflowWrapOptions } from '../types/postcss-replace-overflow-wrap/plugin-options';
import type { pluginOptions as postcssPlaceOptions } from 'postcss-place';
import type { pluginOptions as postcssPrefersColorSchemeOptions } from 'css-prefers-color-scheme';
import type { pluginOptions as postcssColorRebeccapurpleOptions } from 'postcss-color-rebeccapurple';
import type { pluginOptions as postcssRelativeColorSyntaxOptions } from '@csstools/postcss-relative-color-syntax';
import type { pluginOptions as postcssScopePseudoClassOptions } from '@csstools/postcss-scope-pseudo-class';
import type { pluginOptions as postcssSteppedValueFunctionsOptions } from '@csstools/postcss-stepped-value-functions';
import type { postcssFontFamilySystemUIOptions } from '../types/postcss-system-ui-font-family/plugin-options';
import type { pluginOptions as postcssTextDecorationShorthandOptions } from '@csstools/postcss-text-decoration-shorthand';
import type { pluginOptions as postcssTrigonometricFunctionsOptions } from '@csstools/postcss-trigonometric-functions';
import type { pluginOptions as postcssUnsetValueOptions } from '@csstools/postcss-unset-value';

export type pluginsOptions = {
	/** plugin options for "@csstools/postcss-initial" */
	'all-property'?: postcssInitialOptions | boolean
	/** plugin options for "postcss-pseudo-class-any-link" */
	'any-link-pseudo-class'?: postcssPseudoClassAnyLinkOptions | boolean
	/** plugin options for "css-blank-pseudo" */
	'blank-pseudo-class'?: postcssBlankPseudoOptions | boolean
	/** plugin options for "postcss-page-break" */
	'break-properties'?: postcssPageBreakOptions | boolean
	/** plugin options for "@csstools/postcss-cascade-layers" */
	'cascade-layers'?: postcssCascadeLayersOptions | boolean
	/** plugin options for "postcss-attribute-case-insensitive" */
	'case-insensitive-attributes'?: postcssAttributeCaseInsensitiveOptions | boolean
	/** plugin options for "postcss-clamp" */
	'clamp'?: postcssClampOptions | boolean
	/** plugin options for "@csstools/postcss-color-function" */
	'color-function'?: postcssColorFunctionOptions | boolean
	/** plugin options for "postcss-color-functional-notation" */
	'color-functional-notation'?: postcssColorFunctionalNotationOptions | boolean
	/** plugin options for "@csstools/postcss-color-mix-function" */
	'color-mix'?: postcssColorMixFunctionOptions | boolean
	/** plugin options for "postcss-custom-media" */
	'custom-media-queries'?: postcssCustomMediaOptions | boolean
	/** plugin options for "postcss-custom-properties" */
	'custom-properties'?: postcssCustomPropertiesOptions | boolean
	/** plugin options for "postcss-custom-selectors" */
	'custom-selectors'?: postcssCustomSelectorsOptions | boolean
	/** plugin options for "postcss-dir-pseudo-class" */
	'dir-pseudo-class'?: postcssDirPseudoClassOptions | boolean
	/** plugin options for "@csstools/postcss-normalize-display-values" */
	'display-two-values'?: postcssNormalizeDisplayValuesOptions | boolean
	/** plugin options for "postcss-double-position-gradients" */
	'double-position-gradients'?: postcssDoublePositionGradientsOptions | boolean
	/** plugin options for "@csstools/postcss-exponential-functions" */
	'exponential-functions'?: postcssExponentialFunctionsOptions | boolean
	/** plugin options for "@csstools/postcss-logical-float-and-clear" */
	'float-clear-logical-values'?: postcssLogicalFloatAndClearOptions | boolean
	/** plugin options for "postcss-focus-visible" */
	'focus-visible-pseudo-class'?: postcssFocusVisibleOptions | boolean
	/** plugin options for "postcss-focus-within" */
	'focus-within-pseudo-class'?: postcssFocusWithinOptions | boolean
	/** plugin options for "@csstools/postcss-font-format-keywords" */
	'font-format-keywords'?: postcssFontFormatKeywordsOptions | boolean
	/** plugin options for "postcss-font-variant" */
	'font-variant-property'?: postcssFontVariantOptions | boolean
	/** plugin options for "@csstools/postcss-gamut-mapping" */
	'gamut-mapping'?: postcssGamutMappingOptions | boolean
	/** plugin options for "postcss-gap-properties" */
	'gap-properties'?: postcssGapPropertiesOptions | boolean
	/** plugin options for "@csstools/postcss-gradients-interpolation-method" */
	'gradients-interpolation-method'?: postcssGradientsInterpolationMethodOptions | boolean
	/** plugin options for "css-has-pseudo" */
	'has-pseudo-class'?: postcssHasPseudoOptions | boolean
	/** plugin options for "postcss-color-hex-alpha" */
	'hexadecimal-alpha-notation'?: postcssColorHexAlphaOptions | boolean
	/** plugin options for "@csstools/postcss-hwb-function" */
	'hwb-function'?: postcssHWBFunctionOptions | boolean
	/** plugin options for "@csstools/postcss-ic-unit" */
	'ic-unit'?: postcssICUnitOptions | boolean
	/** plugin options for "postcss-image-set-function" */
	'image-set-function'?: postcssImageSetFunctionOptions | boolean
	/** plugin options for "@csstools/postcss-is-pseudo-class" */
	'is-pseudo-class'?: postcssIsPseudoClassOptions | boolean
	/** plugin options for "postcss-lab-function" */
	'lab-function'?: postcssLabFunctionOptions | boolean
	/** plugin options for "@csstools/postcss-logical-overflow" */
	'logical-overflow'?: postcssLogicalOverflowOptions | boolean
	/** plugin options for "@csstools/postcss-logical-overscroll-behavior" */
	'logical-overscroll-behavior'?: postcssLogicalOverscrollBehavorOptions | boolean
	/** plugin options for "postcss-logical" */
	'logical-properties-and-values'?: postcssLogicalOptions | boolean
	/** plugin options for "@csstools/postcss-logical-resize" */
	'logical-resize'?: postcssLogicalResizeOptions | boolean
	/** plugin options for "@csstools/postcss-logical-viewport-units" */
	'logical-viewport-units'?: postcssLogicalViewportUnitsOptions | boolean
	/** plugin options for "@csstools/postcss-media-queries-aspect-ratio-number-values" */
	'media-queries-aspect-ratio-number-values'?: postcssMediaQueriesAspectRatioNumberValuesOptions | boolean
	/** plugin options for "@csstools/postcss-media-minmax" */
	'media-query-ranges'?: postcssMediaMinmaxOptions | boolean
	/** plugin options for "@csstools/postcss-nested-calc" */
	'nested-calc'?: postcssNestedCalcOptions | boolean
	/** plugin options for "postcss-nesting" */
	'nesting-rules'?: postcssNestingOptions | boolean
	/** plugin options for "postcss-selector-not" */
	'not-pseudo-class'?: postcssSelectorNotOptions | boolean
	/** plugin options for "@csstools/postcss-oklab-function" */
	'oklab-function'?: postcssOKLabFunctionOptions | boolean
	/** plugin options for "postcss-opacity-percentage" */
	'opacity-percentage'?: postcssOpacityPercentageOptions | boolean
	/** plugin options for "postcss-overflow-shorthand" */
	'overflow-property'?: postcssOverflowShorthandOptions | boolean
	/** plugin options for "postcss-replace-overflow-wrap" */
	'overflow-wrap-property'?: postcssReplaceOverflowWrapOptions | boolean
	/** plugin options for "postcss-place" */
	'place-properties'?: postcssPlaceOptions | boolean
	/** plugin options for "css-prefers-color-scheme" */
	'prefers-color-scheme-query'?: postcssPrefersColorSchemeOptions | boolean
	/** plugin options for "postcss-color-rebeccapurple" */
	'rebeccapurple-color'?: postcssColorRebeccapurpleOptions | boolean
	/** plugin options for "@csstools/postcss-relative-color-syntax" */
	'relative-color-syntax'?: postcssRelativeColorSyntaxOptions | boolean
	/** plugin options for "@csstools/postcss-scope-pseudo-class" */
	'scope-pseudo-class'?: postcssScopePseudoClassOptions | boolean
	/** plugin options for "@csstools/postcss-stepped-value-functions" */
	'stepped-value-functions'?: postcssSteppedValueFunctionsOptions | boolean
	/** plugin options for "postcss-system-ui-font-family" */
	'system-ui-font-family'?: postcssFontFamilySystemUIOptions | boolean
	/** plugin options for "@csstools/postcss-text-decoration-shorthand" */
	'text-decoration-shorthand'?: postcssTextDecorationShorthandOptions | boolean
	/** plugin options for "@csstools/postcss-trigonometric-functions" */
	'trigonometric-functions'?: postcssTrigonometricFunctionsOptions | boolean
	/** plugin options for "@csstools/postcss-unset-value" */
	'unset-value'?: postcssUnsetValueOptions | boolean
};
