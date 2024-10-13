import parser from 'postcss-selector-parser';
import type { Container, Node } from 'postcss-selector-parser';
import { sourceFrom } from './source';

export function sortCompoundSelectorsInsideComplexSelector(node: Container<string, Node>): void {
	const compoundSelectors: Array<Array<Node>> = [];
	let currentCompoundSelector: Array<Node> = [];

	node.each((childNode) => {
		if (childNode.type === 'combinator') {
			// Push
			// - the current compound selector
			// - the combinator
			compoundSelectors.push(
				currentCompoundSelector,
				[childNode],
			);

			// Start a new compound selector
			currentCompoundSelector = [];
			return;
		}

		if (parser.isPseudoElement(childNode)) {
			// Push the current compound selector
			compoundSelectors.push(currentCompoundSelector);

			// Start a new compound selector with the pseudo element as the first element
			currentCompoundSelector = [childNode];
			return;
		}

		if (childNode.type === 'universal' && currentCompoundSelector.find(x => x.type === 'universal')) {
			childNode.remove();
			return;
		}

		if (childNode.type === 'tag' && currentCompoundSelector.find(x => x.type === 'tag')) {
			childNode.remove();

			const selector = parser.selector({
				value: '',
				...sourceFrom(childNode),
			});
			selector.append(childNode);

			const isPseudoClone = parser.pseudo({ value: ':is', ...sourceFrom(childNode) });
			isPseudoClone.append(selector);

			currentCompoundSelector.push(isPseudoClone);
			return;
		}

		currentCompoundSelector.push(childNode);
	});

	compoundSelectors.push(currentCompoundSelector);

	const sortedCompoundSelectors = [];
	for (let i = 0; i < compoundSelectors.length; i++) {
		const compoundSelector = compoundSelectors[i];
		compoundSelector.sort((a, b) => {
			return selectorTypeOrder(a) - selectorTypeOrder(b);
		});

		sortedCompoundSelectors.push(...compoundSelector);
	}

	node.removeAll();
	for (let i = sortedCompoundSelectors.length - 1; i >= 0; i--) {
		sortedCompoundSelectors[i].remove();
		sortedCompoundSelectors[i].parent = node;
		node.nodes.unshift(sortedCompoundSelectors[i]);
	}
}

function selectorTypeOrder(selector: Node): number {
	if (parser.isPseudoElement(selector)) {
		return selectorTypeOrderIndex.pseudoElement;
	}

	return selectorTypeOrderIndex[selector.type as keyof typeof selectorTypeOrderIndex];
}

const selectorTypeOrderIndex = {
	universal: 0,
	tag: 1,
	pseudoElement: 2,
	nesting: 3,
	id: 4,
	class: 5,
	attribute: 6,
	pseudo: 7,
	comment: 8,
};
