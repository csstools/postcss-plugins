import postcssInitial from '@csstools/postcss-initial';
import postcssAlphaFunction from '@csstools/postcss-alpha-function';
import postcssPseudoClassAnyLink from 'postcss-pseudo-class-any-link';
import postcssBlankPseudo from 'css-blank-pseudo';
import postcssPageBreak from 'postcss-page-break';
import postcssCascadeLayers from '@csstools/postcss-cascade-layers';
import postcssAttributeCaseInsensitive from 'postcss-attribute-case-insensitive';
import postcssClamp from 'postcss-clamp';
import postcssColorFunction from '@csstools/postcss-color-function';
import postcssColorFunctionDisplayP3Linear from '@csstools/postcss-color-function-display-p3-linear';
import postcssColorFunctionalNotation from 'postcss-color-functional-notation';
import postcssColorMixFunction from '@csstools/postcss-color-mix-function';
import postcssColorMixVariadicFunctionArguments from '@csstools/postcss-color-mix-variadic-function-arguments';
import postcssContentAltText from '@csstools/postcss-content-alt-text';
import postcssContrastColorFunction from '@csstools/postcss-contrast-color-function';
import postcssCustomMedia from 'postcss-custom-media';
import postcssCustomProperties from 'postcss-custom-properties';
import postcssCustomSelectors from 'postcss-custom-selectors';
import postcssDirPseudoClass from 'postcss-dir-pseudo-class';
import postcssNormalizeDisplayValues from '@csstools/postcss-normalize-display-values';
import postcssDoublePositionGradients from 'postcss-double-position-gradients';
import postcssExponentialFunctions from '@csstools/postcss-exponential-functions';
import postcssLogicalFloatAndClear from '@csstools/postcss-logical-float-and-clear';
import postcssFocusVisible from 'postcss-focus-visible';
import postcssFocusWithin from 'postcss-focus-within';
import postcssFontFormatKeywords from '@csstools/postcss-font-format-keywords';
import postcssFontVariant from 'postcss-font-variant';
import postcssGamutMapping from '@csstools/postcss-gamut-mapping';
import postcssGapProperties from 'postcss-gap-properties';
import postcssGradientsInterpolationMethod from '@csstools/postcss-gradients-interpolation-method';
import postcssHasPseudo from 'css-has-pseudo';
import postcssColorHexAlpha from 'postcss-color-hex-alpha';
import postcssHWBFunction from '@csstools/postcss-hwb-function';
import postcssICUnit from '@csstools/postcss-ic-unit';
import postcssImageSetFunction from 'postcss-image-set-function';
import postcssIsPseudoClass from '@csstools/postcss-is-pseudo-class';
import postcssLabFunction from 'postcss-lab-function';
import postcssLightDarkFunction from '@csstools/postcss-light-dark-function';
import postcssLogicalOverflow from '@csstools/postcss-logical-overflow';
import postcssLogicalOverscrollBehavor from '@csstools/postcss-logical-overscroll-behavior';
import postcssLogical from 'postcss-logical';
import postcssLogicalResize from '@csstools/postcss-logical-resize';
import postcssLogicalViewportUnits from '@csstools/postcss-logical-viewport-units';
import postcssMediaQueriesAspectRatioNumberValues from '@csstools/postcss-media-queries-aspect-ratio-number-values';
import postcssMediaMinmax from '@csstools/postcss-media-minmax';
import postcssMixins from '@csstools/postcss-mixins';
import postcssNestedCalc from '@csstools/postcss-nested-calc';
import postcssNesting from 'postcss-nesting';
import postcssSelectorNot from 'postcss-selector-not';
import postcssOKLabFunction from '@csstools/postcss-oklab-function';
import postcssOpacityPercentage from 'postcss-opacity-percentage';
import postcssOverflowShorthand from 'postcss-overflow-shorthand';
import postcssReplaceOverflowWrap from 'postcss-replace-overflow-wrap';
import postcssPlace from 'postcss-place';
import postcssPositionAreaProperty from '@csstools/postcss-position-area-property';
import postcssPrefersColorScheme from 'css-prefers-color-scheme';
import postcssProgressiveCustomProperties from '@csstools/postcss-progressive-custom-properties';
import postcssPropertyRulePreludeList from '@csstools/postcss-property-rule-prelude-list';
import postcssRandomFunction from '@csstools/postcss-random-function';
import postcssColorRebeccapurple from 'postcss-color-rebeccapurple';
import postcssRelativeColorSyntax from '@csstools/postcss-relative-color-syntax';
import postcssScopePseudoClass from '@csstools/postcss-scope-pseudo-class';
import postcssSignFunctions from '@csstools/postcss-sign-functions';
import postcssSteppedValueFunctions from '@csstools/postcss-stepped-value-functions';
import postcssSyntaxDescriptorSyntaxProduction from '@csstools/postcss-syntax-descriptor-syntax-production';
import postcssSystemUIFontFamily from '@csstools/postcss-system-ui-font-family';
import postcssTextDecorationShorthand from '@csstools/postcss-text-decoration-shorthand';
import postcssTrigonometricFunctions from '@csstools/postcss-trigonometric-functions';
import postcssUnsetValue from '@csstools/postcss-unset-value';

// postcss plugins ordered by id
export const pluginsById = new Map(
	[
		['all-property', postcssInitial],
		['alpha-function', postcssAlphaFunction],
		['any-link-pseudo-class', postcssPseudoClassAnyLink],
		['blank-pseudo-class', postcssBlankPseudo],
		['break-properties', postcssPageBreak],
		['cascade-layers', postcssCascadeLayers],
		['case-insensitive-attributes', postcssAttributeCaseInsensitive],
		['clamp', postcssClamp],
		['color-function', postcssColorFunction],
		['color-function-display-p3-linear', postcssColorFunctionDisplayP3Linear],
		['color-functional-notation', postcssColorFunctionalNotation],
		['color-mix', postcssColorMixFunction],
		['color-mix-variadic-function-arguments', postcssColorMixVariadicFunctionArguments],
		['content-alt-text', postcssContentAltText],
		['contrast-color-function', postcssContrastColorFunction],
		['custom-media-queries', postcssCustomMedia],
		['custom-properties', postcssCustomProperties],
		['custom-selectors', postcssCustomSelectors],
		['dir-pseudo-class', postcssDirPseudoClass],
		['display-two-values', postcssNormalizeDisplayValues],
		['double-position-gradients', postcssDoublePositionGradients],
		['exponential-functions', postcssExponentialFunctions],
		['float-clear-logical-values', postcssLogicalFloatAndClear],
		['focus-visible-pseudo-class', postcssFocusVisible],
		['focus-within-pseudo-class', postcssFocusWithin],
		['font-format-keywords', postcssFontFormatKeywords],
		['font-variant-property', postcssFontVariant],
		['gamut-mapping', postcssGamutMapping],
		['gap-properties', postcssGapProperties],
		['gradients-interpolation-method', postcssGradientsInterpolationMethod],
		['has-pseudo-class', postcssHasPseudo],
		['hexadecimal-alpha-notation', postcssColorHexAlpha],
		['hwb-function', postcssHWBFunction],
		['ic-unit', postcssICUnit],
		['image-set-function', postcssImageSetFunction],
		['is-pseudo-class', postcssIsPseudoClass],
		['lab-function', postcssLabFunction],
		['light-dark-function', postcssLightDarkFunction],
		['logical-overflow', postcssLogicalOverflow],
		['logical-overscroll-behavior', postcssLogicalOverscrollBehavor],
		['logical-properties-and-values', postcssLogical],
		['logical-resize', postcssLogicalResize],
		['logical-viewport-units', postcssLogicalViewportUnits],
		['media-queries-aspect-ratio-number-values', postcssMediaQueriesAspectRatioNumberValues],
		['media-query-ranges', postcssMediaMinmax],
		['mixins', postcssMixins],
		['nested-calc', postcssNestedCalc],
		['nesting-rules', postcssNesting],
		['not-pseudo-class', postcssSelectorNot],
		['oklab-function', postcssOKLabFunction],
		['opacity-percentage', postcssOpacityPercentage],
		['overflow-property', postcssOverflowShorthand],
		['overflow-wrap-property', postcssReplaceOverflowWrap],
		['place-properties', postcssPlace],
		['position-area-property', postcssPositionAreaProperty],
		['prefers-color-scheme-query', postcssPrefersColorScheme],
		['progressive-custom-properties', postcssProgressiveCustomProperties],
		['property-rule-prelude-list', postcssPropertyRulePreludeList],
		['random-function', postcssRandomFunction],
		['rebeccapurple-color', postcssColorRebeccapurple],
		['relative-color-syntax', postcssRelativeColorSyntax],
		['scope-pseudo-class', postcssScopePseudoClass],
		['sign-functions', postcssSignFunctions],
		['stepped-value-functions', postcssSteppedValueFunctions],
		['syntax-descriptor-syntax-production', postcssSyntaxDescriptorSyntaxProduction],
		['system-ui-font-family', postcssSystemUIFontFamily],
		['text-decoration-shorthand', postcssTextDecorationShorthand],
		['trigonometric-functions', postcssTrigonometricFunctions],
		['unset-value', postcssUnsetValue],
	],
);
