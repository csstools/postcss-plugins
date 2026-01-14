import type { pluginOptions as postcssInitialOptions } from '@csstools/postcss-initial';
import type { pluginOptions as postcssAlphaFunctionOptions } from '@csstools/postcss-alpha-function';
import type { pluginOptions as postcssPseudoClassAnyLinkOptions } from 'postcss-pseudo-class-any-link';
import type { pluginOptions as postcssBlankPseudoOptions } from 'css-blank-pseudo';
import type { postcssPageBreakOptions } from '../types/postcss-page-break/plugin-options';
import type { pluginOptions as postcssCascadeLayersOptions } from '@csstools/postcss-cascade-layers';
import type { pluginOptions as postcssAttributeCaseInsensitiveOptions } from 'postcss-attribute-case-insensitive';
import type { postcssClampOptions } from '../types/postcss-clamp/plugin-options';
import type { pluginOptions as postcssColorFunctionOptions } from '@csstools/postcss-color-function';
import type { pluginOptions as postcssColorFunctionDisplayP3LinearOptions } from '@csstools/postcss-color-function-display-p3-linear';
import type { pluginOptions as postcssColorFunctionalNotationOptions } from 'postcss-color-functional-notation';
import type { pluginOptions as postcssColorMixFunctionOptions } from '@csstools/postcss-color-mix-function';
import type { pluginOptions as postcssColorMixVariadicFunctionArgumentsOptions } from '@csstools/postcss-color-mix-variadic-function-arguments';
import type { pluginOptions as postcssContentAltTextOptions } from '@csstools/postcss-content-alt-text';
import type { pluginOptions as postcssContrastColorFunctionOptions } from '@csstools/postcss-contrast-color-function';
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
import type { pluginOptions as postcssLightDarkFunctionOptions } from '@csstools/postcss-light-dark-function';
import type { pluginOptions as postcssLogicalOverflowOptions } from '@csstools/postcss-logical-overflow';
import type { pluginOptions as postcssLogicalOverscrollBehavorOptions } from '@csstools/postcss-logical-overscroll-behavior';
import type { pluginOptions as postcssLogicalOptions } from 'postcss-logical';
import type { pluginOptions as postcssLogicalResizeOptions } from '@csstools/postcss-logical-resize';
import type { pluginOptions as postcssLogicalViewportUnitsOptions } from '@csstools/postcss-logical-viewport-units';
import type { pluginOptions as postcssMediaQueriesAspectRatioNumberValuesOptions } from '@csstools/postcss-media-queries-aspect-ratio-number-values';
import type { pluginOptions as postcssMediaMinmaxOptions } from '@csstools/postcss-media-minmax';
import type { pluginOptions as postcssMixinsOptions } from '@csstools/postcss-mixins';
import type { pluginOptions as postcssNestedCalcOptions } from '@csstools/postcss-nested-calc';
import type { pluginOptions as postcssNestingOptions } from 'postcss-nesting';
import type { pluginOptions as postcssSelectorNotOptions } from 'postcss-selector-not';
import type { pluginOptions as postcssOKLabFunctionOptions } from '@csstools/postcss-oklab-function';
import type { postcssOpacityPercentageOptions } from '../types/postcss-opacity-percentage/plugin-options';
import type { pluginOptions as postcssOverflowShorthandOptions } from 'postcss-overflow-shorthand';
import type { postcssReplaceOverflowWrapOptions } from '../types/postcss-replace-overflow-wrap/plugin-options';
import type { pluginOptions as postcssPlaceOptions } from 'postcss-place';
import type { pluginOptions as postcssPositionAreaPropertyOptions } from '@csstools/postcss-position-area-property';
import type { pluginOptions as postcssPrefersColorSchemeOptions } from 'css-prefers-color-scheme';
import type { pluginOptions as postcssPropertyRulePreludeListOptions } from '@csstools/postcss-property-rule-prelude-list';
import type { pluginOptions as postcssRandomFunctionOptions } from '@csstools/postcss-random-function';
import type { pluginOptions as postcssColorRebeccapurpleOptions } from 'postcss-color-rebeccapurple';
import type { pluginOptions as postcssRelativeColorSyntaxOptions } from '@csstools/postcss-relative-color-syntax';
import type { pluginOptions as postcssScopePseudoClassOptions } from '@csstools/postcss-scope-pseudo-class';
import type { pluginOptions as postcssSignFunctionsOptions } from '@csstools/postcss-sign-functions';
import type { pluginOptions as postcssSteppedValueFunctionsOptions } from '@csstools/postcss-stepped-value-functions';
import type { pluginOptions as postcssSyntaxDescriptorSyntaxProductionOptions } from '@csstools/postcss-syntax-descriptor-syntax-production';
import type { pluginOptions as postcssSystemUIFontFamilyOptions } from '@csstools/postcss-system-ui-font-family';
import type { pluginOptions as postcssTextDecorationShorthandOptions } from '@csstools/postcss-text-decoration-shorthand';
import type { pluginOptions as postcssTrigonometricFunctionsOptions } from '@csstools/postcss-trigonometric-functions';
import type { pluginOptions as postcssUnsetValueOptions } from '@csstools/postcss-unset-value';

export type subPluginOptions<T> = ['auto' | boolean, T] | T | boolean;

export type pluginsOptions = {
	/** plugin options for "@csstools/postcss-initial" */
	'all-property'?: subPluginOptions<postcssInitialOptions>
	/** plugin options for "@csstools/postcss-alpha-function" */
	'alpha-function'?: subPluginOptions<postcssAlphaFunctionOptions>
	/** plugin options for "postcss-pseudo-class-any-link" */
	'any-link-pseudo-class'?: subPluginOptions<postcssPseudoClassAnyLinkOptions>
	/** plugin options for "css-blank-pseudo" */
	'blank-pseudo-class'?: subPluginOptions<postcssBlankPseudoOptions>
	/** plugin options for "postcss-page-break" */
	'break-properties'?: subPluginOptions<postcssPageBreakOptions>
	/** plugin options for "@csstools/postcss-cascade-layers" */
	'cascade-layers'?: subPluginOptions<postcssCascadeLayersOptions>
	/** plugin options for "postcss-attribute-case-insensitive" */
	'case-insensitive-attributes'?: subPluginOptions<postcssAttributeCaseInsensitiveOptions>
	/** plugin options for "postcss-clamp" */
	'clamp'?: subPluginOptions<postcssClampOptions>
	/** plugin options for "@csstools/postcss-color-function" */
	'color-function'?: subPluginOptions<postcssColorFunctionOptions>
	/** plugin options for "@csstools/postcss-color-function-display-p3-linear" */
	'color-function-display-p3-linear'?: subPluginOptions<postcssColorFunctionDisplayP3LinearOptions>
	/** plugin options for "postcss-color-functional-notation" */
	'color-functional-notation'?: subPluginOptions<postcssColorFunctionalNotationOptions>
	/** plugin options for "@csstools/postcss-color-mix-function" */
	'color-mix'?: subPluginOptions<postcssColorMixFunctionOptions>
	/** plugin options for "@csstools/postcss-color-mix-variadic-function-arguments" */
	'color-mix-variadic-function-arguments'?: subPluginOptions<postcssColorMixVariadicFunctionArgumentsOptions>
	/** plugin options for "@csstools/postcss-content-alt-text" */
	'content-alt-text'?: subPluginOptions<postcssContentAltTextOptions>
	/** plugin options for "@csstools/postcss-contrast-color-function" */
	'contrast-color-function'?: subPluginOptions<postcssContrastColorFunctionOptions>
	/** plugin options for "postcss-custom-media" */
	'custom-media-queries'?: subPluginOptions<postcssCustomMediaOptions>
	/** plugin options for "postcss-custom-properties" */
	'custom-properties'?: subPluginOptions<postcssCustomPropertiesOptions>
	/** plugin options for "postcss-custom-selectors" */
	'custom-selectors'?: subPluginOptions<postcssCustomSelectorsOptions>
	/** plugin options for "postcss-dir-pseudo-class" */
	'dir-pseudo-class'?: subPluginOptions<postcssDirPseudoClassOptions>
	/** plugin options for "@csstools/postcss-normalize-display-values" */
	'display-two-values'?: subPluginOptions<postcssNormalizeDisplayValuesOptions>
	/** plugin options for "postcss-double-position-gradients" */
	'double-position-gradients'?: subPluginOptions<postcssDoublePositionGradientsOptions>
	/** plugin options for "@csstools/postcss-exponential-functions" */
	'exponential-functions'?: subPluginOptions<postcssExponentialFunctionsOptions>
	/** plugin options for "@csstools/postcss-logical-float-and-clear" */
	'float-clear-logical-values'?: subPluginOptions<postcssLogicalFloatAndClearOptions>
	/** plugin options for "postcss-focus-visible" */
	'focus-visible-pseudo-class'?: subPluginOptions<postcssFocusVisibleOptions>
	/** plugin options for "postcss-focus-within" */
	'focus-within-pseudo-class'?: subPluginOptions<postcssFocusWithinOptions>
	/** plugin options for "@csstools/postcss-font-format-keywords" */
	'font-format-keywords'?: subPluginOptions<postcssFontFormatKeywordsOptions>
	/** plugin options for "postcss-font-variant" */
	'font-variant-property'?: subPluginOptions<postcssFontVariantOptions>
	/** plugin options for "@csstools/postcss-gamut-mapping" */
	'gamut-mapping'?: subPluginOptions<postcssGamutMappingOptions>
	/** plugin options for "postcss-gap-properties" */
	'gap-properties'?: subPluginOptions<postcssGapPropertiesOptions>
	/** plugin options for "@csstools/postcss-gradients-interpolation-method" */
	'gradients-interpolation-method'?: subPluginOptions<postcssGradientsInterpolationMethodOptions>
	/** plugin options for "css-has-pseudo" */
	'has-pseudo-class'?: subPluginOptions<postcssHasPseudoOptions>
	/** plugin options for "postcss-color-hex-alpha" */
	'hexadecimal-alpha-notation'?: subPluginOptions<postcssColorHexAlphaOptions>
	/** plugin options for "@csstools/postcss-hwb-function" */
	'hwb-function'?: subPluginOptions<postcssHWBFunctionOptions>
	/** plugin options for "@csstools/postcss-ic-unit" */
	'ic-unit'?: subPluginOptions<postcssICUnitOptions>
	/** plugin options for "postcss-image-set-function" */
	'image-set-function'?: subPluginOptions<postcssImageSetFunctionOptions>
	/** plugin options for "@csstools/postcss-is-pseudo-class" */
	'is-pseudo-class'?: subPluginOptions<postcssIsPseudoClassOptions>
	/** plugin options for "postcss-lab-function" */
	'lab-function'?: subPluginOptions<postcssLabFunctionOptions>
	/** plugin options for "@csstools/postcss-light-dark-function" */
	'light-dark-function'?: subPluginOptions<postcssLightDarkFunctionOptions>
	/** plugin options for "@csstools/postcss-logical-overflow" */
	'logical-overflow'?: subPluginOptions<postcssLogicalOverflowOptions>
	/** plugin options for "@csstools/postcss-logical-overscroll-behavior" */
	'logical-overscroll-behavior'?: subPluginOptions<postcssLogicalOverscrollBehavorOptions>
	/** plugin options for "postcss-logical" */
	'logical-properties-and-values'?: subPluginOptions<postcssLogicalOptions>
	/** plugin options for "@csstools/postcss-logical-resize" */
	'logical-resize'?: subPluginOptions<postcssLogicalResizeOptions>
	/** plugin options for "@csstools/postcss-logical-viewport-units" */
	'logical-viewport-units'?: subPluginOptions<postcssLogicalViewportUnitsOptions>
	/** plugin options for "@csstools/postcss-media-queries-aspect-ratio-number-values" */
	'media-queries-aspect-ratio-number-values'?: subPluginOptions<postcssMediaQueriesAspectRatioNumberValuesOptions>
	/** plugin options for "@csstools/postcss-media-minmax" */
	'media-query-ranges'?: subPluginOptions<postcssMediaMinmaxOptions>
	/** plugin options for "@csstools/postcss-mixins" */
	'mixins'?: subPluginOptions<postcssMixinsOptions>
	/** plugin options for "@csstools/postcss-nested-calc" */
	'nested-calc'?: subPluginOptions<postcssNestedCalcOptions>
	/** plugin options for "postcss-nesting" */
	'nesting-rules'?: subPluginOptions<postcssNestingOptions>
	/** plugin options for "postcss-selector-not" */
	'not-pseudo-class'?: subPluginOptions<postcssSelectorNotOptions>
	/** plugin options for "@csstools/postcss-oklab-function" */
	'oklab-function'?: subPluginOptions<postcssOKLabFunctionOptions>
	/** plugin options for "postcss-opacity-percentage" */
	'opacity-percentage'?: subPluginOptions<postcssOpacityPercentageOptions>
	/** plugin options for "postcss-overflow-shorthand" */
	'overflow-property'?: subPluginOptions<postcssOverflowShorthandOptions>
	/** plugin options for "postcss-replace-overflow-wrap" */
	'overflow-wrap-property'?: subPluginOptions<postcssReplaceOverflowWrapOptions>
	/** plugin options for "postcss-place" */
	'place-properties'?: subPluginOptions<postcssPlaceOptions>
	/** plugin options for "@csstools/postcss-position-area-property" */
	'position-area-property'?: subPluginOptions<postcssPositionAreaPropertyOptions>
	/** plugin options for "css-prefers-color-scheme" */
	'prefers-color-scheme-query'?: subPluginOptions<postcssPrefersColorSchemeOptions>
	/** plugin options for "@csstools/postcss-property-rule-prelude-list" */
	'property-rule-prelude-list'?: subPluginOptions<postcssPropertyRulePreludeListOptions>
	/** plugin options for "@csstools/postcss-random-function" */
	'random-function'?: subPluginOptions<postcssRandomFunctionOptions>
	/** plugin options for "postcss-color-rebeccapurple" */
	'rebeccapurple-color'?: subPluginOptions<postcssColorRebeccapurpleOptions>
	/** plugin options for "@csstools/postcss-relative-color-syntax" */
	'relative-color-syntax'?: subPluginOptions<postcssRelativeColorSyntaxOptions>
	/** plugin options for "@csstools/postcss-scope-pseudo-class" */
	'scope-pseudo-class'?: subPluginOptions<postcssScopePseudoClassOptions>
	/** plugin options for "@csstools/postcss-sign-functions" */
	'sign-functions'?: subPluginOptions<postcssSignFunctionsOptions>
	/** plugin options for "@csstools/postcss-stepped-value-functions" */
	'stepped-value-functions'?: subPluginOptions<postcssSteppedValueFunctionsOptions>
	/** plugin options for "@csstools/postcss-syntax-descriptor-syntax-production" */
	'syntax-descriptor-syntax-production'?: subPluginOptions<postcssSyntaxDescriptorSyntaxProductionOptions>
	/** plugin options for "@csstools/postcss-system-ui-font-family" */
	'system-ui-font-family'?: subPluginOptions<postcssSystemUIFontFamilyOptions>
	/** plugin options for "@csstools/postcss-text-decoration-shorthand" */
	'text-decoration-shorthand'?: subPluginOptions<postcssTextDecorationShorthandOptions>
	/** plugin options for "@csstools/postcss-trigonometric-functions" */
	'trigonometric-functions'?: subPluginOptions<postcssTrigonometricFunctionsOptions>
	/** plugin options for "@csstools/postcss-unset-value" */
	'unset-value'?: subPluginOptions<postcssUnsetValueOptions>
};
