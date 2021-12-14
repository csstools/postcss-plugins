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
	return fromSelectors.flatMap((fromSelector) => {
		let fromSelectorAST = parser().astSync(fromSelector);

		// If the from selector is simple we extract the first non root, non selector node
		if (fromSelectorAST.type === 'root' && fromSelectorAST.nodes.length === 1) {
			fromSelectorAST = fromSelectorAST.nodes[0];
		}

		if (fromSelectorAST.type === 'selector' && fromSelectorAST.nodes.length === 1) {
			fromSelectorAST = fromSelectorAST.nodes[0];
		}

		return toSelectors.map((toSelector) => {
			return parser((selectors) => {
				selectors.walkNesting((toSelectorAST) => {
					const fromIsSimple = isSimpleSelector(fromSelectorAST);
					const toIsSimple = isSimpleSelector(toSelectorAST);

					const fromIsCompound = isCompoundSelector(fromSelectorAST);
					const toIsCompound = isCompoundSelector(toSelectorAST);

					// Parent and child are simple
					if (fromIsSimple && toIsSimple) {
						toSelectorAST.replaceWith(fromSelectorAST.clone());
						return;
					}

					// Parent and child are simple or compound
					if ((fromIsSimple || fromIsCompound) && (toIsSimple || toIsCompound)) {
						const parent = toSelectorAST.parent;
						toSelectorAST.replaceWith(fromSelectorAST.clone());

						if (parent && parent.nodes.length > 1) {
							sortCompoundSelector(parent);
							wrapMultipleTagSelectorsWithIsPseudo(parent);
						}

						return;
					}

					// Parent is simple, but child is complex
					if (fromIsSimple) {
						const fromClone = fromSelectorAST.clone();
						toSelectorAST.replaceWith(fromClone);
						return;
					}
				});
			}).processSync(toSelector);
		});
	});

	// let complexFromSelector = false;
	// let fromSelectorIsList = fromSelectors.length > 1;
	// const fromSelectorAST = parser().astSync(fromSelectors.join(','));
	// const fromSelectorWithIsAST = parser().astSync(`:is(${fromSelectors.join(',')})`);

	// let fromSelectorCounterAST = 0;
	// fromSelectorAST.walk((x) => {
	// 	if (x.type === 'root') {
	// 		return;
	// 	}

	// 	fromSelectorCounterAST++;
	// });

	// if (fromSelectorCounterAST > 2) {
	// 	complexFromSelector = true;
	// }

	// return toSelectors.map((toSelector) => {
	// 	return parser((selectors) => {
	// 		selectors.walkNesting((selector) => {
	// 			if (fromSelectorIsList) {
	// 				selector.replaceWith(fromSelectorWithIsAST.clone());
	// 				return;
	// 			}

	// 			// foo &foo foo & baz -> foo &:is(foo) foo & baz
	// 			if (
	// 				selector.next() &&
	// 				selector.next().type === 'tag'
	// 			) {
	// 				const isPseudo = parser.pseudo({ value: ':is' });
	// 				isPseudo.append(selector.next().clone());
	// 				selector.next().replaceWith(isPseudo);

	// 				if (complexFromSelector) {
	// 					selector.replaceWith(fromSelectorWithIsAST.clone());
	// 					return;
	// 				}

	// 				selector.replaceWith(fromSelectorAST.clone());
	// 				return;
	// 			}

	// 			// h1 and foo can combine to fooh1|h1foo which would be a different selector.
	// 			// h1 and .foo can combine to .fooh1 which would be a different selector.
	// 			// h1 { .foo& {} } -> h1.foo: {}
	// 			// h1 { foo& {} } -> foo:is(h1) {}
	// 			if (
	// 				selector.prev() &&
	// 				selector.prev().type !== 'combinator' &&
	// 				fromSelectorAST.first &&
	// 				fromSelectorAST.first.first &&
	// 				fromSelectorAST.first.first.type === 'tag'
	// 			) {
	// 				if (complexFromSelector) {
	// 					selector.replaceWith(fromSelectorWithIsAST.clone());
	// 					return;
	// 				}

	// 				let firstPrecedingNonCombinatorNode = selector.prev();
	// 				while (firstPrecedingNonCombinatorNode.prev() && firstPrecedingNonCombinatorNode.prev().type !== 'combinator') {
	// 					firstPrecedingNonCombinatorNode = firstPrecedingNonCombinatorNode.prev();
	// 				}

	// 				if (firstPrecedingNonCombinatorNode.type !== 'tag') {
	// 					// Safe to just prepend the parent selector.
	// 					// h1 { .foo& {} } -> h1.foo: {}
	// 					selector.parent.insertBefore(firstPrecedingNonCombinatorNode, fromSelectorAST.clone());
	// 					selector.remove();
	// 					return;
	// 				}

	// 				// Unsafe -> wrapping the parent selector in :is().
	// 				// h1 { foo& {} } -> foo:is(h1) {}
	// 				const isPseudo = parser.pseudo({ value: ':is' });
	// 				isPseudo.append(fromSelectorAST.clone());
	// 				selector.replaceWith(isPseudo);
	// 				return;
	// 			}

	// 			selector.replaceWith(fromSelectorAST.clone());
	// 		});
	// 	}).processSync(toSelector);
	// });
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

function wrapMultipleTagSelectorsWithIsPseudo(node) {
	const tagNodes = node.nodes.filter((x) => {
		return x.type === 'tag';
	});

	if (tagNodes > 1) {
		tagNodes.slice(1).forEach((child) => {
			const isPseudoClone = isPseudo.clone();
			child.replaceWith(isPseudoClone);
			isPseudoClone.append(child);
		});
	}
}
