import postcssInitial from 'postcss-initial';
import postcssPseudoClassAnyLink from 'postcss-pseudo-class-any-link';
import postcssBlankPseudo from 'css-blank-pseudo';
import postcssPageBreak from 'postcss-page-break';
import postcssCascadeLayers from '@csstools/postcss-cascade-layers';
import postcssAttributeCaseInsensitive from 'postcss-attribute-case-insensitive';
import postcssClamp from 'postcss-clamp';
import postcssColorFunction from '@csstools/postcss-color-function';
import postcssColorFunctionalNotation from 'postcss-color-functional-notation';
import postcssCustomMedia from 'postcss-custom-media';
import postcssCustomProperties from 'postcss-custom-properties';
import postcssCustomSelectors from 'postcss-custom-selectors';
import postcssDirPseudoClass from 'postcss-dir-pseudo-class';
import postcssNormalizeDisplayValues from '@csstools/postcss-normalize-display-values';
import postcssDoublePositionGradients from 'postcss-double-position-gradients';
import postcssEnvFunction from 'postcss-env-function';
import postcssFocusVisible from 'postcss-focus-visible';
import postcssFocusWithin from 'postcss-focus-within';
import postcssFontFormatKeywords from '@csstools/postcss-font-format-keywords';
import postcssFontVariant from 'postcss-font-variant';
import postcssGapProperties from 'postcss-gap-properties';
import postcssHasPseudo from 'css-has-pseudo';
import postcssColorHexAlpha from 'postcss-color-hex-alpha';
import postcssHWBFunction from '@csstools/postcss-hwb-function';
import postcssICUnit from '@csstools/postcss-ic-unit';
import postcssImageSetFunction from 'postcss-image-set-function';
import postcssIsPseudoClass from '@csstools/postcss-is-pseudo-class';
import postcssLabFunction from 'postcss-lab-function';
import postcssLogical from 'postcss-logical';
import postcssMediaMinmax from 'postcss-media-minmax';
import postcssNestedCalc from '@csstools/postcss-nested-calc';
import postcssNesting from 'postcss-nesting';
import postcssSelectorNot from 'postcss-selector-not';
import postcssOKLabFunction from '@csstools/postcss-oklab-function';
import postcssOpacityPercentage from 'postcss-opacity-percentage';
import postcssOverflowShorthand from 'postcss-overflow-shorthand';
import postcssReplaceOverflowWrap from 'postcss-replace-overflow-wrap';
import postcssPlace from 'postcss-place';
import postcssPrefersColorScheme from 'css-prefers-color-scheme';
import postcssColorRebeccapurple from 'postcss-color-rebeccapurple';
import postcssSteppedValueFunctions from '@csstools/postcss-stepped-value-functions';
import postcssFontFamilySystemUI from '../patch/postcss-system-ui-font-family.mjs';
import postcssTextDecorationShorthand from '@csstools/postcss-text-decoration-shorthand';
import postcssTrigonometricFunctions from '@csstools/postcss-trigonometric-functions';
import postcssUnsetValue from '@csstools/postcss-unset-value';

// postcss plugins ordered by id
export const pluginsById = new Map(
	[
		['all-property', postcssInitial],
		['any-link-pseudo-class', postcssPseudoClassAnyLink],
		['blank-pseudo-class', postcssBlankPseudo],
		['break-properties', postcssPageBreak],
		['cascade-layers', postcssCascadeLayers],
		['case-insensitive-attributes', postcssAttributeCaseInsensitive],
		['clamp', postcssClamp],
		['color-function', postcssColorFunction],
		['color-functional-notation', postcssColorFunctionalNotation],
		['custom-media-queries', postcssCustomMedia],
		['custom-properties', postcssCustomProperties],
		['custom-selectors', postcssCustomSelectors],
		['dir-pseudo-class', postcssDirPseudoClass],
		['display-two-values', postcssNormalizeDisplayValues],
		['double-position-gradients', postcssDoublePositionGradients],
		['environment-variables', postcssEnvFunction],
		['focus-visible-pseudo-class', postcssFocusVisible],
		['focus-within-pseudo-class', postcssFocusWithin],
		['font-format-keywords', postcssFontFormatKeywords],
		['font-variant-property', postcssFontVariant],
		['gap-properties', postcssGapProperties],
		['has-pseudo-class', postcssHasPseudo],
		['hexadecimal-alpha-notation', postcssColorHexAlpha],
		['hwb-function', postcssHWBFunction],
		['ic-unit', postcssICUnit],
		['image-set-function', postcssImageSetFunction],
		['is-pseudo-class', postcssIsPseudoClass],
		['lab-function', postcssLabFunction],
		['logical-properties-and-values', postcssLogical],
		['media-query-ranges', postcssMediaMinmax],
		['nested-calc', postcssNestedCalc],
		['nesting-rules', postcssNesting],
		['not-pseudo-class', postcssSelectorNot],
		['oklab-function', postcssOKLabFunction],
		['opacity-percentage', postcssOpacityPercentage],
		['overflow-property', postcssOverflowShorthand],
		['overflow-wrap-property', postcssReplaceOverflowWrap],
		['place-properties', postcssPlace],
		['prefers-color-scheme-query', postcssPrefersColorScheme],
		['rebeccapurple-color', postcssColorRebeccapurple],
		['stepped-value-functions', postcssSteppedValueFunctions],
		['system-ui-font-family', postcssFontFamilySystemUI],
		['text-decoration-shorthand', postcssTextDecorationShorthand],
		['trigonometric-functions', postcssTrigonometricFunctions],
		['unset-value', postcssUnsetValue],
	],
);
