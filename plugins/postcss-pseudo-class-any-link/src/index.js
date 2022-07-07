import { replaceAnyLink } from './replace-any-link';

/**
 * @param {{preserve?: boolean, subFeatures?: { areaHrefNeedsFixing?: boolean }}} opts
 * @returns {import('postcss').Plugin}
 */
function creator(opts) {
	const options = {
		preserve: true,
		...opts,
	};

	const subFeatures = {
		areaHrefNeedsFixing: false,
		...Object(options.subFeatures),
	};

	return {
		postcssPlugin: 'postcss-pseudo-class-any-link',
		Rule(rule, { result }) {
			if (!rule.selector.toLowerCase().includes(':any-link')) {
				return;
			}

			const rawSelector = rule.raws.selector && rule.raws.selector.raw || rule.selector;

			// workaround for https://github.com/postcss/postcss-selector-parser/issues/28#issuecomment-171910556
			if (rawSelector.endsWith(':')) {
				return;
			}

			replaceAnyLink(rule, result, options.preserve, subFeatures.areaHrefNeedsFixing);
		},
	};
}

creator.postcss = true;

export default creator;
