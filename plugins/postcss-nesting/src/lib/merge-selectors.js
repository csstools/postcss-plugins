import parser from 'postcss-selector-parser';

const isPseudo = parser.pseudo({ value: ':is' });

const selectorTypeOrder = {
	universal: 0,
	tag: 1,
	id: 2,
	class: 3,
	attribute: 4,
	pseudo: 5,
	nesting: 6,
	selector: 7,
	string: 8,
	root : 9,
	comment: 10,
};

export default function mergeSelectors(fromSelectors, toSelectors) {
	let fromSelectorAST = parser().astSync(fromSelectors.join(','));
	const fromSelectorWithIsAST = parser().astSync(`:is(${fromSelectors.join(',')})`);
	if (fromSelectors.length > 1) {
		fromSelectorAST = fromSelectorWithIsAST;
	}

	// If the from selector is simple we extract the first non root, non selector node
	if (fromSelectorAST.type === 'root' && fromSelectorAST.nodes.length === 1) {
		fromSelectorAST = fromSelectorAST.nodes[0];
	}

	const fromIsSimple = isSimpleSelector(fromSelectorAST.nodes[0]); // this function looks at the parent of the node passed as an argument
	const fromIsCompound = isCompoundSelector(fromSelectorAST.nodes[0]); // this function looks at the parent of the node passed as an argument

	return toSelectors.map((toSelector) => {
		return parser((selectors) => {
			selectors.walkNesting((toSelectorAST) => {
				const toIsSimple = isSimpleSelector(toSelectorAST);
				const toIsCompound = isCompoundSelector(toSelectorAST);

				// Parent and child are simple
				if (fromIsSimple && toIsSimple) {
					toSelectorAST.replaceWith(fromSelectorAST.clone());
					return;
				}

				// Parent and child are simple or compound
				if ((fromIsSimple || fromIsCompound) && (toIsSimple || toIsCompound)) {
					const parent = toSelectorAST.parent;

					if (fromIsSimple && fromSelectorAST.type === 'selector') {
						// fromSelectorAST has type selector with a single child
						toSelectorAST.replaceWith(fromSelectorAST.clone().nodes[0]);
					} else {
						// fromSelectorAST has type selector containing a compound selector
						toSelectorAST.replaceWith(...(fromSelectorAST.clone().nodes));
					}

					if (parent && parent.nodes.length > 1) {
						sortCompoundSelector(parent);
						wrapMultipleTagSelectorsWithIsPseudo(parent);
					}

					return;
				}

				if (!toIsCompound) {
					const parent = toSelectorAST.parent;
					if (fromIsSimple && fromSelectorAST.type === 'selector') {
						// fromSelectorAST has type selector with a single child
						toSelectorAST.replaceWith(fromSelectorAST.clone().nodes[0]);
					} else {
						// fromSelectorAST has type selector containing a compound selector
						toSelectorAST.replaceWith(...(fromSelectorAST.clone().nodes));
					}

					if (parent) {
						sortCompoundSelectorsInsideComplexSelector(parent);
					}
				}

				const parent = toSelectorAST.parent;
				toSelectorAST.replaceWith(...(fromSelectorWithIsAST.clone().nodes));

				if (parent) {
					sortCompoundSelectorsInsideComplexSelector(parent);
				}

				return;
			});
		}).processSync(toSelector);
	});
}

function isSimpleSelector(selector) {
	if (selector.type === 'combinator') {
		return false;
	}

	if (selector.parent && selector.parent.nodes.length > 1) {
		return false;
	}

	return true;
}

function isCompoundSelector(selector) {
	if (isSimpleSelector(selector)) {
		return false;
	}

	if (!selector.parent) {
		return false;
	}

	const hasCombinators = !!(selector.parent.nodes.find((x) => {
		return x.type === 'combinator' || x.type === 'comment';
	}));

	if (hasCombinators) {
		return false;
	}

	return true;
}

function sortCompoundSelector(node) {
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

function sortCompoundSelectorsInsideComplexSelector(node) {
	let compound = [];

	const nodes = [...node.nodes];

	for (let i = 0; i < (nodes.length+1); i++) {
		const child = nodes[i];
		if (!child || child.type === 'combinator') {
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
			}

			compound = [];
			continue;
		}

		compound.push(child);
	}
}

function wrapMultipleTagSelectorsWithIsPseudo(node) {
	const tagNodes = node.nodes.filter((x) => {
		return x.type === 'tag';
	});

	if (tagNodes.length > 1) {
		tagNodes.slice(1).forEach((child) => {
			const isPseudoClone = isPseudo.clone();
			child.replaceWith(isPseudoClone);
			isPseudoClone.append(child);
		});
	}
}
