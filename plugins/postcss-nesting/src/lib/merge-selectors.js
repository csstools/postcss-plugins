import parser from 'postcss-selector-parser';

export default function mergeSelectors(fromSelectors, toSelectors) {
	let complexFromSelector = false;
	let fromSelectorIsList = fromSelectors.length > 1;
	const fromSelectorAST = parser().astSync(fromSelectors.join(','));
	const fromSelectorWithIsAST = parser().astSync(`:is(${fromSelectors.join(',')})`);

	let fromSelectorCounterAST = 0;
	fromSelectorAST.walk((x) => {
		if (x.type === 'root') {
			return;
		}

		fromSelectorCounterAST++;
	});

	if (fromSelectorCounterAST > 2) {
		complexFromSelector = true;
	}

	return toSelectors.map((toSelector) => {
		return parser((selectors) => {
			selectors.walkNesting((selector) => {
				if (fromSelectorIsList) {
					selector.replaceWith(fromSelectorWithIsAST.clone());
					return;
				}

				// foo &foo foo & baz -> foo &:is(foo) foo & baz
				if (
					selector.next() &&
					selector.next().type === 'tag'
				) {
					const isPseudo = parser.pseudo({ value: ':is' });
					isPseudo.append(selector.next().clone());
					selector.next().replaceWith(isPseudo);

					if (complexFromSelector) {
						selector.replaceWith(fromSelectorWithIsAST.clone());
						return;
					}

					selector.replaceWith(fromSelectorAST.clone());
					return;
				}

				// h1 and foo can combine to fooh1|h1foo which would be a different selector.
				// h1 and .foo can combine to .fooh1 which would be a different selector.
				// h1 { .foo& {} } -> h1.foo: {}
				// h1 { foo& {} } -> foo:is(h1) {}
				if (
					selector.prev() &&
					selector.prev().type !== 'combinator' &&
					fromSelectorAST.first &&
					fromSelectorAST.first.first &&
					fromSelectorAST.first.first.type === 'tag'
				) {
					if (complexFromSelector) {
						selector.replaceWith(fromSelectorWithIsAST.clone());
						return;
					}

					let firstPrecedingNonCombinatorNode = selector.prev();
					while (firstPrecedingNonCombinatorNode.prev() && firstPrecedingNonCombinatorNode.prev().type !== 'combinator') {
						firstPrecedingNonCombinatorNode = firstPrecedingNonCombinatorNode.prev();
					}

					if (firstPrecedingNonCombinatorNode.type !== 'tag') {
						// Safe to just prepend the parent selector.
						// h1 { .foo& {} } -> h1.foo: {}
						selector.parent.insertBefore(firstPrecedingNonCombinatorNode, fromSelectorAST.clone());
						selector.remove();
						return;
					}

					// Unsafe -> wrapping the parent selector in :is().
					// h1 { foo& {} } -> foo:is(h1) {}
					const isPseudo = parser.pseudo({ value: ':is' });
					isPseudo.append(fromSelectorAST.clone());
					selector.replaceWith(isPseudo);
					return;
				}

				selector.replaceWith(fromSelectorAST.clone());
			});
		}).processSync(toSelector);
	});
}
