import walk from './lib/walk.js';

/**
 * @param {{noIsPseudoSelector?: boolean}} opts
 * @returns {import('postcss').Plugin}
 */
export default function postcssNesting(opts) {
	const noIsPseudoSelector = Object(opts).noIsPseudoSelector || false;
	return {
		postcssPlugin: 'postcss-nesting',
		Rule(rule) {
			walk(rule, {noIsPseudoSelector: noIsPseudoSelector});
		},
	};
}

postcssNesting.postcss = true;
