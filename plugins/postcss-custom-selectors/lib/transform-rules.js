import parser from 'postcss-selector-parser';
import transformSelectorsByCustomSelectors from './transform-selectors-by-custom-selectors';

// transform custom pseudo selectors with custom selectors
export default (root, customSelectors, opts) => {
	root.walkRules(customPseudoRegExp, rule => {
		const selector = parser(selectors => {
			transformSelectorsByCustomSelectors(selectors, customSelectors, opts)
		}).processSync(rule.selector);

		if (opts.preserve) {
			rule.cloneBefore({ selector });
		} else {
			rule.selector = selector;
		}
	});
};

const customPseudoRegExp = /:--[A-z][\w-]*/;
