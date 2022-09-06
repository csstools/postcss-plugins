import type { Root, Selector } from 'postcss-selector-parser';
import parser from 'postcss-selector-parser';

// transform custom pseudo selectors with custom selectors
export default (rule, customSelectors: Map<string, Root>, opts: { preserve?: boolean }) => {
	const selector = parser(selectors => {
		selectors.walkPseudos((pseudo) => {
			if (!customSelectors.has(pseudo.value)) {
				return;
			}

			const isWrapper = parser.pseudo({
				value: ':is',
				nodes: [],
			});

			const base = customSelectors.get(pseudo.value);
			base.each((node) => {
				isWrapper.append(node.clone({}) as Selector);
			});

			pseudo.replaceWith(isWrapper);

		});
	}).processSync(rule.selector);

	if (selector === rule.selector) {
		return;
	}

	rule.cloneBefore({ selector: selector });

	if (!opts.preserve) {
		rule.remove();
	}
};
