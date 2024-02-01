import type { Root, Selector } from 'postcss-selector-parser';
import parser from 'postcss-selector-parser';
import { sourceFrom } from './source';
import { combinationsWithSizeN } from './combinations';

/**
 * Flatten a nested selector against a given parent selector.
 *
 * ⚠️ This is not a method to generate the equivalent un-nested selector.
 * It is purely a method to construct a single selector AST that contains the parts of both the current and parent selector.
 * It will not have the correct specificity and it will not match the right elements when used as a selector.
 * It will not always serialize to a valid selector.
 *
 * @param selector - The selector to resolve.
 * @param parentSelector - The parent selector to resolve against.
 * @returns The resolved selector.
 */
export function flattenNestedSelector(selector: Root, parentSelector: Root): Root {
	const result: Array<Selector> = [];

	for (let x = 0; x < selector.nodes.length; x++) {
		const selectorAST = selector.nodes[x].clone();
		let nestingCounter = 0;

		{
			let isNestContaining = false;
			selectorAST.walkNesting(() => {
				isNestContaining = true;
				nestingCounter++;
			});

			if (!isNestContaining) {
				selectorAST.prepend(parser.combinator({ value: ' ', ...sourceFrom(selectorAST) }));
				selectorAST.prepend(parser.nesting({ ...sourceFrom(selectorAST) }));
				nestingCounter++;
			} else if (selectorAST.nodes[0]?.type === 'combinator') {
				selectorAST.prepend(parser.nesting({ ...sourceFrom(selectorAST) }));
				nestingCounter++;
			}
		}

		let iterations: number;
		let parentSelectorCombinations: Array<Array<Selector>> = [];

		if (nestingCounter > 1 && parentSelector.nodes.length > 1) {
			parentSelectorCombinations = combinationsWithSizeN(parentSelector.nodes, nestingCounter);
			iterations = parentSelectorCombinations.length;
		} else {
			iterations = parentSelector.nodes.length;
			for (let i = 0; i < parentSelector.nodes.length; i++) {
				parentSelectorCombinations.push([]);

				for (let j = 0; j < nestingCounter; j++) {
					parentSelectorCombinations[i].push(parentSelector.nodes[i].clone());
				}
			}
		}

		for (let y = 0; y < iterations; y++) {
			let counter = 0;
			const currentIteration = selectorAST.clone();

			currentIteration.walkNesting((node) => {
				const parentSelectorCombination = parentSelectorCombinations[y][counter];
				counter++;

				node.replaceWith(...parentSelectorCombination.nodes);
			});

			result.push(currentIteration);
		}
	}

	const root = parser.root({
		value: '',
		...sourceFrom(selector),
	});

	result.forEach((x) => {
		root.append(x);
	});

	return root;
}
