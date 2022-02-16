import postcssAttributeCaseInsensitive from 'postcss-attribute-case-insensitive';
import postcssBlankPseudo from 'css-blank-pseudo';
import postcssColorFunctionalNotation from 'postcss-color-functional-notation';
import postcssColorHexAlpha from 'postcss-color-hex-alpha';
import postcssColorRebeccapurple from 'postcss-color-rebeccapurple';
import postcssCustomMedia from 'postcss-custom-media';
import postcssCustomProperties from 'postcss-custom-properties';
import postcssCustomSelectors from 'postcss-custom-selectors';
import postcssDirPseudoClass from 'postcss-dir-pseudo-class';
import postcssDoublePositionGradients from 'postcss-double-position-gradients';
import postcssEnvFunction from 'postcss-env-function';
import postcssFocusVisible from 'postcss-focus-visible';
import postcssFocusWithin from 'postcss-focus-within';
import postcssFontVariant from 'postcss-font-variant';
import postcssFontFamilySystemUi from '../patch/postcss-system-ui-font-family.mjs';
import postcssGapProperties from 'postcss-gap-properties';
import postcssHasPseudo from 'css-has-pseudo';
import postcssImageSetPolyfill from 'postcss-image-set-function';
import postcssInitial from 'postcss-initial';
import postcssLabFunction from 'postcss-lab-function';
import postcssLogical from 'postcss-logical';
import postcssMediaMinmax from 'postcss-media-minmax';
import postcssNesting from 'postcss-nesting';
import postcssOverflowShorthand from 'postcss-overflow-shorthand';
import postcssPageBreak from 'postcss-page-break';
import postcssPlace from 'postcss-place';
import postcssPrefersColorScheme from 'css-prefers-color-scheme';
import postcssPseudoClassAnyLink from 'postcss-pseudo-class-any-link';
import postcssReplaceOverflowWrap from 'postcss-replace-overflow-wrap';
import postcssSelectorNot from 'postcss-selector-not';
import postcssIsPseudoClass from '@csstools/postcss-is-pseudo-class';
import postcssHWBFunction from '@csstools/postcss-hwb-function';
import postcssOpacityPercentage from 'postcss-opacity-percentage';
import postcssClamp from 'postcss-clamp';
import postcssFontFormatKeywords from '@csstools/postcss-font-format-keywords';
import postcssNormalizeDisplayValues from '@csstools/postcss-normalize-display-values';
import postcssColorFunction from '@csstools/postcss-color-function';
import postcssOKLabFunction from '@csstools/postcss-oklab-function';
import postcssICUnit from '@csstools/postcss-ic-unit';

// postcss plugins ordered by id
export const pluginsById = new Map(
	[
		['all-property', postcssInitial],
		['any-link-pseudo-class', postcssPseudoClassAnyLink],
		['blank-pseudo-class', postcssBlankPseudo],
		['break-properties', postcssPageBreak],
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
		['hwb-function', postcssHWBFunction],
		['has-pseudo-class', postcssHasPseudo],
		['hexadecimal-alpha-notation', postcssColorHexAlpha],
		['ic-unit', postcssICUnit],
		['image-set-function', postcssImageSetPolyfill],
		['is-pseudo-class', postcssIsPseudoClass],
		['lab-function', postcssLabFunction],
		['logical-properties-and-values', postcssLogical],
		['media-query-ranges', postcssMediaMinmax],
		['nesting-rules', postcssNesting],
		['not-pseudo-class', postcssSelectorNot],
		['oklab-function', postcssOKLabFunction],
		['opacity-percentage', postcssOpacityPercentage],
		['overflow-property', postcssOverflowShorthand],
		['overflow-wrap-property', postcssReplaceOverflowWrap],
		['place-properties', postcssPlace],
		['prefers-color-scheme-query', postcssPrefersColorScheme],
		['rebeccapurple-color', postcssColorRebeccapurple],
		['system-ui-font-family', postcssFontFamilySystemUi],
	],
);
