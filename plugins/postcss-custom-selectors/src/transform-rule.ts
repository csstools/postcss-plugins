import parser from 'postcss-selector-parser';
import type { Result, Rule } from 'postcss';
import type { Root } from 'postcss-selector-parser';

// Custom selectors can reference each other and duplicate their contents.
// Every substitution can duplicate the remaining references, so the number of
// substitutions grows exponentially with the nesting depth. Bound the total
// number of substitutions performed for a single rule.
const MAX_EXPANSIONS = 100_000;

// transform custom pseudo selectors with custom selectors
export function transformRule(rule: Rule, result: Result, customSelectors: Map<string, Root>): string {
	let selector = rule.selector;

	try {
		let expansionBudget = MAX_EXPANSIONS;

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

				expansionBudget--;
				if (expansionBudget < 0) {
					throw new Error('Maximum custom selector expansion size exceeded, reduce the complexity of your custom selectors');
				}

				base.each((node) => {
					isWrapper.append(node.clone());
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
