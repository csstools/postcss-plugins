import parser from 'postcss-selector-parser';

export default function mergeSelectors(fromSelectors: Array<string>, toSelectors: Array<string>) {
	const result = [];
	if (toSelectors.length === 0) {
		return;
	}

	const fromSelectorsAST = parser().astSync(`:is(${fromSelectors.join(',')})`);

	for (let x = 0; x < toSelectors.length; x++) {
		const toSelectorAST = parser().astSync(toSelectors[x]);
		if (!toSelectorAST) {
			continue;
		}

		let isNestContaining = false;
		toSelectorAST.walk((maybeNesting) => {
			if (maybeNesting.type === 'nesting') {
				isNestContaining = true;
			}
		});

		if (!isNestContaining) {
			const selectorAST = toSelectorAST.nodes[0];
			let startsWithCombinator = false;
			selectorAST.each((maybeCombinator) => {
				if (maybeCombinator.type === 'combinator') {
					startsWithCombinator = true;
					return false;
				}

				// see : https://github.com/w3c/csswg-drafts/issues/7979
				if (parser.isPseudoElement(maybeCombinator)) {
					startsWithCombinator = true;
					return false;
				}

				return false;
			});

			if (startsWithCombinator) {
				selectorAST.insertBefore(selectorAST.at(0) , parser.nesting({}));
			} else {
				selectorAST.insertBefore(selectorAST.at(0), parser.combinator({value: ' '}));
				selectorAST.insertBefore(selectorAST.at(0), parser.nesting({}));
			}
		}

		toSelectorAST.walk((nesting) => {
			if (nesting.type !== 'nesting') {
				return;
			}

			nesting.replaceWith(fromSelectorsAST.clone({}));
		});

		result.push(toSelectorAST.toString());
	}

	return result;
}

