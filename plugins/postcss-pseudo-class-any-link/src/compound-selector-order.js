import parser from 'postcss-selector-parser';

export function sortCompoundSelectorsInsideComplexSelector(node) {
	if (!node || !node.nodes) {
		return;
	}

	let compound = [];
	const nodes = [...node.nodes];

	for (let i = 0; i < (nodes.length+1); i++) {
		const child = nodes[i];
		if (!child || child.type === 'combinator') {
			if (compound.length > 1) {
				const compoundSelector = parser.selector({value:''});
				compound[0].replaceWith(compoundSelector);

				compound.slice(1).forEach((compoundPart) => {
					compoundPart.remove();
				});

				compound.forEach((compoundPart) => {
					compoundSelector.append(compoundPart);
				});

				sortCompoundSelector(compoundSelector);
				compoundSelector.replaceWith(...(compoundSelector.nodes));
			}

			compound = [];
			continue;
		}

		compound.push(child);
	}
}

export function sortCompoundSelector(node) {
	if (!node || !node.nodes) {
		return;
	}
	// simply concatenating with selectors can lead to :
	// `.fooh1`
	//
	// applying a sort where tag selectors are first will result in :
	// `h1.foo`

	node.nodes.sort((a, b) => {
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
	id: 2,
	class: 3,
	attribute: 4,
	selector: 5,
	pseudo: 6,
	pseudoElement: 7,
	string: 8,
	root: 9,
	comment: 10,
};
