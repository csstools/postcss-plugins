import parser from 'postcss-selector-parser';

export function sortCompoundSelectorsInsideComplexSelector(node) {
	if (!node || !node.nodes) {
		return;
	}

	const compoundSelectors = [];
	let currentCompoundSelector = [];
	for (let i = 0; i < node.nodes.length; i++) {
		if (node.nodes[i].type === 'combinator') {
			// Push the current compound selector
			compoundSelectors.push(currentCompoundSelector);

			// Push the combinator
			compoundSelectors.push([node.nodes[i]]);

			// Start a new compound selector
			currentCompoundSelector = [];

			continue;
		}

		if (parser.isPseudoElement(node.nodes[i])) {
			// Push the current compound selector
			compoundSelectors.push(currentCompoundSelector);

			// Start a new compound selector with the pseudo element as the first element
			currentCompoundSelector = [node.nodes[i]];

			continue;
		}

		currentCompoundSelector.push(node.nodes[i]);
	}

	compoundSelectors.push(currentCompoundSelector);

	const sortedCompoundSelectors = [];
	for (let i = 0; i < compoundSelectors.length; i++) {
		const compoundSelector = compoundSelectors[i];
		compoundSelector.sort((a, b) => {
			if (a.type === 'selector' && b.type === 'selector' && a.nodes.length && b.nodes.length) {
				return selectorTypeOrder(a.nodes[0], a.nodes[0].type) - selectorTypeOrder(b.nodes[0], b.nodes[0].type);
			}

			if (a.type === 'selector' && a.nodes.length) {
				return selectorTypeOrder(a.nodes[0], a.nodes[0].type) - selectorTypeOrder(b, b.type);
			}

			if (b.type === 'selector' && b.nodes.length) {
				return selectorTypeOrder(a, a.type) - selectorTypeOrder(b.nodes[0], b.nodes[0].type);
			}

			return selectorTypeOrder(a, a.type) - selectorTypeOrder(b, b.type);
		});

		for (let j = 0; j < compoundSelector.length; j++) {
			sortedCompoundSelectors.push(compoundSelector[j]);
		}
	}

	for (let i = sortedCompoundSelectors.length - 1; i >= 0; i--) {
		sortedCompoundSelectors[i].remove();
		node.prepend(sortedCompoundSelectors[i]);
	}
}

function selectorTypeOrder(selector, type) {
	if (parser.isPseudoElement(selector)) {
		return selectorTypeOrderIndex.pseudoElement;
	}

	return selectorTypeOrderIndex[type];
}

const selectorTypeOrderIndex = {
	universal: 0,
	tag: 1,
	pseudoElement: 2,
	id: 3,
	class: 4,
	attribute: 5,
	pseudo: 6,
	selector: 7,
	string: 8,
	root: 9,
	comment: 10,
};
