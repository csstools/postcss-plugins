import { handleAreaHref } from './area-href';
import { handleLinkAndVisited } from './link-visited';

const anyAnyLinkMatch = /:any-link/;

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
			if (!anyAnyLinkMatch.test(rule.selector)) {
				return;
			}

			const rawSelector = rule.raws.selector && rule.raws.selector.raw || rule.selector;

			// workaround for https://github.com/postcss/postcss-selector-parser/issues/28#issuecomment-171910556
			if (rawSelector[rawSelector.length - 1] === ':') {
				return;
			}

			if (subFeatures.areaHrefNeedsFixing) {
				handleAreaHref(rule, result);
			}

			handleLinkAndVisited(rule, result, options.preserve);
		},
	};
}

creator.postcss = true;

export default creator;
