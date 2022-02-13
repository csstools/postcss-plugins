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
