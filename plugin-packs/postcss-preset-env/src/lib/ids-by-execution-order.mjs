// ids ordered by required execution, then alphabetically
export default [
	'custom-media-queries',
	'custom-properties',
	'environment-variables', // run environment-variables here to access transpiled custom media params and properties
	'image-set-function', // run images-set-function before nesting-rules so that it may fix nested media
	'media-query-ranges', // run media-query-range and
	'prefers-color-scheme-query', // run prefers-color-scheme-query here to prevent duplicate transpilation after nesting-rules
	'nesting-rules',
	'custom-selectors', // run custom-selectors after nesting-rules to correctly transpile &:--custom-selector
	'any-link-pseudo-class',
	'case-insensitive-attributes',
	'focus-visible-pseudo-class',
	'focus-within-pseudo-class',
	'not-pseudo-class', // run not-pseudo-class after other selectors have been transpiled
	'logical-properties-and-values', // run logical-properties-and-values before dir-pseudo-class
	'dir-pseudo-class',
	'all-property', // run all-property before other property polyfills
	'color-functional-notation',
	'double-position-gradients',
	'hexadecimal-alpha-notation',
	'hwb-function',
	'lab-function',
	'rebeccapurple-color',
	'blank-pseudo-class',
	'break-properties',
	'font-variant-property',
	'is-pseudo-class', // after other selector transforms, before :has()
	'has-pseudo-class',
	'gap-properties',
	'overflow-property',
	'overflow-wrap-property',
	'place-properties',
	'system-ui-font-family',
	'cascade-layers',
	'stepped-value-functions',
	'trigonometric-functions',
];
