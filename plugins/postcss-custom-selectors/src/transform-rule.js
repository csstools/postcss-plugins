import parser from 'postcss-selector-parser';
import transformSelectorsByCustomSelectors from './transform-selectors-by-custom-selectors';

// transform custom pseudo selectors with custom selectors
export default (rule, customSelectors, opts) => {
	const selector = parser(selectors => {
		transformSelectorsByCustomSelectors(selectors, customSelectors, opts);
	}).processSync(rule.selector);

	if (selector === rule.selector) {
		return;
	}

	rule.cloneBefore({ selector: selector });

	if (!opts.preserve) {
		rule.remove();
	}
};
