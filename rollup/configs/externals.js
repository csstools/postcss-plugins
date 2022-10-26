export const externalsForCLI = [
	'fs',
	'path',
	'url',
	'vm',

	'@csstools/css-parser-algorithms',
	'@csstools/css-tokenizer',
	'@csstools/media-query-list-parser',
	'@csstools/postcss-cascade-layers',
	'@csstools/postcss-color-function',
	'@csstools/postcss-font-format-keywords',
	'@csstools/postcss-hwb-function',
	'@csstools/postcss-ic-unit',
	'@csstools/postcss-is-pseudo-class',
	'@csstools/postcss-nested-calc',
	'@csstools/postcss-normalize-display-values',
	'@csstools/postcss-oklab-function',
	'@csstools/postcss-progressive-custom-properties',
	'@csstools/postcss-stepped-value-functions',
	'@csstools/postcss-text-decoration-shorthand',
	'@csstools/postcss-trigonometric-functions',
	'@csstools/postcss-unset-value',
	'@csstools/selector-specificity',
	'autoprefixer',
	'browserslist',
	'caniuse-lite',
	'css-blank-pseudo',
	'css-has-pseudo',
	'css-prefers-color-scheme',
	'cssdb',
	'postcss-attribute-case-insensitive',
	'postcss-color-functional-notation',
	'postcss-color-hex-alpha',
	'postcss-color-rebeccapurple',
	'postcss-custom-media',
	'postcss-custom-properties',
	'postcss-custom-selectors',
	'postcss-dir-pseudo-class',
	'postcss-double-position-gradients',
	'postcss-env-function',
	'postcss-focus-visible',
	'postcss-focus-within',
	'postcss-font-variant',
	'postcss-gap-properties',
	'postcss-image-set-function',
	'postcss-initial',
	'postcss-lab-function',
	'postcss-logical',
	'postcss-media-minmax',
	'postcss-nesting',
	'postcss-overflow-shorthand',
	'postcss-page-break',
	'postcss-place',
	'postcss-pseudo-class-any-link',
	'postcss-replace-overflow-wrap',
	'postcss-selector-not',
	'postcss-selector-parser',
	'postcss-value-parser',
];

export const externalsForPlugin = [
	'assert',
	'fs',
	'module',
	'path',
	'url',
	'vm',

	'postcss',
	/^postcss-\d\.\d$/,
	/^postcss\/lib\/*/,
	'postcss-html',

	'@csstools/css-parser-algorithms',
	'@csstools/css-tokenizer',
	'@csstools/media-query-list-parser',
	'@csstools/postcss-cascade-layers',
	'@csstools/postcss-color-function',
	'@csstools/postcss-font-format-keywords',
	'@csstools/postcss-hwb-function',
	'@csstools/postcss-ic-unit',
	'@csstools/postcss-is-pseudo-class',
	'@csstools/postcss-nested-calc',
	'@csstools/postcss-normalize-display-values',
	'@csstools/postcss-oklab-function',
	'@csstools/postcss-progressive-custom-properties',
	'@csstools/postcss-stepped-value-functions',
	'@csstools/postcss-text-decoration-shorthand',
	'@csstools/postcss-trigonometric-functions',
	'@csstools/postcss-unset-value',
	'@csstools/selector-specificity',
	'autoprefixer',
	'browserslist',
	'caniuse-lite',
	'css-blank-pseudo',
	'css-has-pseudo',
	'css-prefers-color-scheme',
	'cssdb',
	'postcss-attribute-case-insensitive',
	'postcss-clamp',
	'postcss-color-functional-notation',
	'postcss-color-hex-alpha',
	'postcss-color-rebeccapurple',
	'postcss-custom-media',
	'postcss-custom-properties',
	'postcss-custom-selectors',
	'postcss-dir-pseudo-class',
	'postcss-double-position-gradients',
	'postcss-env-function',
	'postcss-focus-visible',
	'postcss-focus-within',
	'postcss-font-variant',
	'postcss-gap-properties',
	'postcss-image-set-function',
	'postcss-initial',
	'postcss-lab-function',
	'postcss-logical',
	'postcss-media-minmax',
	'postcss-nesting',
	'postcss-opacity-percentage',
	'postcss-overflow-shorthand',
	'postcss-page-break',
	'postcss-place',
	'postcss-pseudo-class-any-link',
	'postcss-replace-overflow-wrap',
	'postcss-selector-not',
	'postcss-selector-parser',
	'postcss-value-parser',
];

export const externalsForBrowser = [];

export const externalsForDeno = [];
