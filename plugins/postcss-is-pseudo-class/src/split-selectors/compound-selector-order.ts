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
	// compound selectors with nesting can be written with tag selectors as later parts.
	// for example : `&h1`
	//
	// simply concating with parent selectors can lead to :
	// `.fooh1`
	//
	// applying a sort where tag selectors are first will result in :
	// `h1.foo`

	node.nodes.sort((a, b) => {
		if (a.type === 'selector' && b.type === 'selector' && a.nodes.length && b.nodes.length) {
			if (a.nodes[0].type === b.nodes[0].type) {
				return 0;
			}

			if (selectorTypeOrder[a.nodes[0].type] < selectorTypeOrder[b.nodes[0].type]) {
				return -1;
			}

			if (selectorTypeOrder[a.nodes[0].type] > selectorTypeOrder[b.nodes[0].type]) {
				return 1;
			}
		}

		if (a.type === 'selector' && a.nodes.length) {
			if (a.nodes[0].type === b.type) {
				return 0;
			}

			if (selectorTypeOrder[a.nodes[0].type] < selectorTypeOrder[b.type]) {
				return -1;
			}

			if (selectorTypeOrder[a.nodes[0].type] > selectorTypeOrder[b.type]) {
				return 1;
			}
		}

		if (b.type === 'selector' && b.nodes.length) {
			if (a.type === b.nodes[0].type) {
				return 0;
			}

			if (selectorTypeOrder[a.type] < selectorTypeOrder[b.nodes[0].type]) {
				return -1;
			}

			if (selectorTypeOrder[a.type] > selectorTypeOrder[b.nodes[0].type]) {
				return 1;
			}
		}

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
};
