import parser from 'postcss-selector-parser';
import type { Result, Rule } from 'postcss';
import type { Root, Selector } from 'postcss-selector-parser';

// transform custom pseudo selectors with custom selectors
export function transformRule(rule: Rule, result: Result, customSelectors: Map<string, Root>): string {
	let selector = rule.selector;

	try {
		selector = parser(selectors => {
			selectors.walkPseudos((pseudo) => {
				if (!customSelectors.has(pseudo.value)) {
					return;
				}

				const isWrapper = parser.pseudo({
					value: ':is',
					nodes: [],
				});

				const base = customSelectors.get(pseudo.value);

				if (!base) {
					return;
				}

				base.each((node) => {
					isWrapper.append(node.clone({}) as Selector);
				});

				pseudo.replaceWith(isWrapper);
			});
		}).processSync(rule.selector);
	} catch (err) {
		rule.warn(result, `Failed to parse selector : "${selector}" with message: "${(err instanceof Error) ? err.message : err}"`);
		return rule.selector;
	}

	return selector;
}
