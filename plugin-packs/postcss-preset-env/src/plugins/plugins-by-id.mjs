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
import postcssICUnit from 'postcss-ic-unit';
import postcssNormalizeDisplayValues from '@csstools/postcss-normalize-display-values';

export const packageNamesToIds = {
	'css-blank-pseudo': 'blank-pseudo-class',
	'css-has-pseudo': 'has-pseudo-class',
	'css-prefers-color-scheme': 'prefers-color-scheme-query',
	'postcss-attribute-case-insensitive': 'case-insensitive-attributes',
	'postcss-clamp': 'clamp',
	'postcss-color-functional-notation': 'color-functional-notation',
	'postcss-color-hex-alpha': 'hexadecimal-alpha-notation',
	'postcss-color-rebeccapurple': 'rebeccapurple-color',
	'postcss-custom-media': 'custom-media-queries',
	'postcss-custom-properties': 'custom-properties',
	'postcss-custom-selectors': 'custom-selectors',
	'postcss-dir-pseudo-class': 'dir-pseudo-class',
	'postcss-double-position-gradients': 'double-position-gradients',
	'postcss-env-function': 'environment-variables',
	'postcss-focus-visible': 'focus-visible-pseudo-class',
	'postcss-focus-within': 'focus-within-pseudo-class',
	'postcss-font-format-keywords': 'font-format-keywords',
	'postcss-font-variant': 'font-variant-property',
	'postcss-gap-properties': 'gap-properties',
	'postcss-hwb-function': 'hwb-function',
	'postcss-ic-unit': 'ic-unit',
	'postcss-image-set-function': 'image-set-function',
	'postcss-initial': 'all-property',
	'postcss-is-pseudo-class': 'is-pseudo-class',
	'postcss-lab-function': 'lab-function',
	'postcss-logical': 'logical-properties-and-values',
	'postcss-media-minmax': 'media-query-ranges',
	'postcss-nesting': 'nesting-rules',
	'postcss-normalize-display-values': 'display-two-values',
	'postcss-opacity-percentage': 'opacity-percentage',
	'postcss-overflow-shorthand': 'overflow-property',
	'postcss-page-break': 'break-properties',
	'postcss-place': 'place-properties',
	'postcss-pseudo-class-any-link': 'any-link-pseudo-class',
	'postcss-replace-overflow-wrap': 'overflow-wrap-property',
	'postcss-selector-not': 'not-pseudo-class',
	'postcss-system-ui-font-family': 'system-ui-font-family',
};

export const idsToPackageNames = (() => {
	const out = {};
	for (const [packageName, id] of Object.entries(packageNamesToIds)) {
		out[id] = packageName;
	}

	return out;
})();

// postcss plugins ordered by id
export const pluginsById = new Map(
	[
		['all-property', postcssInitial],
		['any-link-pseudo-class', postcssPseudoClassAnyLink],
		['blank-pseudo-class', postcssBlankPseudo],
		['break-properties', postcssPageBreak],
		['case-insensitive-attributes', postcssAttributeCaseInsensitive],
		['clamp', postcssClamp],
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
		['image-set-function', postcssImageSetPolyfill],
		['is-pseudo-class', postcssIsPseudoClass],
		['lab-function', postcssLabFunction],
		['logical-properties-and-values', postcssLogical],
		['media-query-ranges', postcssMediaMinmax],
		['nesting-rules', postcssNesting],
		['not-pseudo-class', postcssSelectorNot],
		['opacity-percentage', postcssOpacityPercentage],
		['overflow-property', postcssOverflowShorthand],
		['overflow-wrap-property', postcssReplaceOverflowWrap],
		['place-properties', postcssPlace],
		['prefers-color-scheme-query', postcssPrefersColorScheme],
		['rebeccapurple-color', postcssColorRebeccapurple],
		['system-ui-font-family', postcssFontFamilySystemUi],
	],
);
