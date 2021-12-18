import parser from 'postcss-selector-parser';

import { wrapMultipleTagSelectorsWithIsPseudo } from './wrap-multiple-tag-selectors-with-is-pseudo';

export function sortCompoundSelectorsInsideComplexSelector(node) {
	let compound = [];
	let foundOtherNesting = false;

	const nodes = [...node.nodes];

	for (let i = 0; i < (nodes.length+1); i++) {
		const child = nodes[i];
		if (!child || child.type === 'combinator') {
			if (foundOtherNesting) {
				// nesting walker will further manipulate the selector and revisit this function later.
				// not skipping here will break the nesting walker as the order and contents of the nodes have changed too much.
				compound = [];
				continue;
			}

			if (compound.length > 1) {
				const compoundSelector = parser.selector();
				compound[0].replaceWith(compoundSelector);

				compound.slice(1).forEach((compoundPart) => {
					compoundPart.remove();
				});

				compound.forEach((compoundPart) => {
					compoundSelector.append(compoundPart);
				});

				sortCompoundSelector(compoundSelector);
				wrapMultipleTagSelectorsWithIsPseudo(compoundSelector);
				compoundSelector.replaceWith(...(compoundSelector.nodes));
			}

			compound = [];
			continue;
		}

		if (child.type === 'nesting') {
			foundOtherNesting = true;
		}

		compound.push(child);
	}
}

export function sortCompoundSelector(node) {
	node.nodes.sort((a, b) => {
		if (a.type === b.type) {
			return 0;
		}

		if (selectorTypeOrder[a.type] < selectorTypeOrder[b.type]) {
			return -1;
		}

		return 1;
	});
}

const selectorTypeOrder = {
	universal: 0,
	tag: 1,
	id: 2,
	class: 3,
	attribute: 4,
	pseudo: 5,
	selector: 7,
	string: 8,
	root : 9,
	comment: 10,

	nesting: 9999,
};
