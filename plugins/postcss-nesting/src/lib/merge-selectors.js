import parser from 'postcss-selector-parser';
import { combinationsWithSizeN } from './merge-selectors/combinations-of-size-n';
import { sortCompoundSelector, sortCompoundSelectorsInsideComplexSelector } from './merge-selectors/compound-selector-order';
import { nodesAreEquallySpecific } from './merge-selectors/specificity';
import { wrapMultipleTagSelectorsWithIsPseudo } from './merge-selectors/wrap-multiple-tag-selectors-with-is-pseudo';

export default function mergeSelectors(fromSelectors, toSelectors, opts) {
	const fromListHasUniformSpecificity = nodesAreEquallySpecific(fromSelectors);

	let fromSelectorsAST = [];

	if (fromListHasUniformSpecificity || opts.noIsPseudoSelector) {
		fromSelectorsAST = fromSelectors.map((selector) => {
			return parser().astSync(selector);
		});
	} else {
		fromSelectorsAST = [parser().astSync(`:is(${fromSelectors.join(',')})`)];
	}

	let result = [];

	for (let x = 0; x < toSelectors.length; x++) {
		const toSelector = toSelectors[x];

		let iterations = 1;
		let fromSelectorCombinations = [];

		let nestingCounter = 0;
		parser().astSync(toSelector).walkNesting(() => {
			nestingCounter++;
		});

		if (nestingCounter > 1 && fromSelectorsAST.length > 1) {
			fromSelectorCombinations = combinationsWithSizeN(fromSelectorsAST, nestingCounter);
			iterations = fromSelectorCombinations.length;
		} else {
			iterations = fromSelectorsAST.length;
			for (let i = 0; i < fromSelectorsAST.length; i++) {
				fromSelectorCombinations.push([]);

				for (let j = 0; j < nestingCounter; j++) {
					fromSelectorCombinations[i].push(fromSelectorsAST[i]);
				}
			}
		}

		for (let y = 0; y < iterations; y++) {
			let counter = 0;

			const toSelectorAST = parser().astSync(toSelector);
			toSelectorAST.walk((nesting) => {
				if (nesting.type !== 'nesting') {
					return;
				}

				let fromSelectorAST = fromSelectorCombinations[y][counter];
				counter++;

				// If the from selector is simple we extract the first non root, non selector node
				if (fromSelectorAST.type === 'root' && fromSelectorAST.nodes.length === 1) {
					fromSelectorAST = fromSelectorAST.nodes[0];
				}

				const fromSelectorWithIsAST = parser().astSync(`:is(${fromSelectorAST.toString()})`);

				const fromIsSimple = isSimpleSelector(fromSelectorAST.nodes[0]); // this function looks at the parent of the node passed as an argument
				const fromIsCompound = isCompoundSelector(fromSelectorAST.nodes[0]); // this function looks at the parent of the node passed as an argument

				const toIsSimple = isSimpleSelector(nesting);
				const toIsCompound = isCompoundSelector(nesting);

				// Parent and child are simple
				if (fromIsSimple && toIsSimple) {
					nesting.replaceWith(fromSelectorAST.clone());
					return;
				}

				// Parent and child are simple or compound
				if ((fromIsSimple || fromIsCompound) && (toIsSimple || toIsCompound)) {
					const parent = nesting.parent;

					if (fromIsSimple && fromSelectorAST.type === 'selector') {
						// fromSelectorAST has type selector with a single child
						nesting.replaceWith(fromSelectorAST.clone().nodes[0]);
					} else {
						// fromSelectorAST has type selector containing a compound selector
						nesting.replaceWith(...(fromSelectorAST.clone().nodes));
					}

					if (parent && parent.nodes.length > 1) {
						sortCompoundSelector(parent);

						if (!opts.noIsPseudoSelector) {
							wrapMultipleTagSelectorsWithIsPseudo(parent);
						}
					}

					return;
				}

				if (fromIsSimple) {
					const parent = nesting.parent;
					nesting.replaceWith(fromSelectorAST.clone().nodes[0]);

					if (parent) {
						sortCompoundSelectorsInsideComplexSelector(parent, !opts.noIsPseudoSelector);
					}

					return;
				}

				if (fromIsCompound) {
					const parent = nesting.parent;
					nesting.replaceWith(...(fromSelectorAST.clone().nodes));

					if (parent) {
						sortCompoundSelectorsInsideComplexSelector(parent, !opts.noIsPseudoSelector);
					}

					return;
				}

				if (nestingIsFirstAndOnlyInSelectorWithEitherSpaceOrChildCombinator(nesting)) {
					const parent = nesting.parent;
					nesting.replaceWith(...(fromSelectorAST.clone().nodes));

					if (parent) {
						sortCompoundSelectorsInsideComplexSelector(parent, !opts.noIsPseudoSelector);
					}

					return;
				}

				if (nestingIsNotInsideCompoundSelector(nesting)) {
					const parent = nesting.parent;
					nesting.replaceWith(...(fromSelectorAST.clone().nodes));

					if (parent) {
						sortCompoundSelectorsInsideComplexSelector(parent, !opts.noIsPseudoSelector);
					}

					return;
				}

				const parent = nesting.parent;
				if (opts.noIsPseudoSelector) {
					nesting.replaceWith(...(fromSelectorAST.clone().nodes));
				} else {
					nesting.replaceWith(...(fromSelectorWithIsAST.clone().nodes));
				}

				if (parent) {
					sortCompoundSelectorsInsideComplexSelector(parent, !opts.noIsPseudoSelector);
				}
			});

			result.push(toSelectorAST.toString());
		}
	}

	return result;
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

function isCompoundSelector(selector, toSelector = null) {
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

	const hasExtraNesting = !!(selector.parent.nodes.find((x) => {
		return x.type === 'nesting';
	}));

	if (hasExtraNesting && toSelector && !isCompoundSelector(toSelector)) {
		return false;
	}

	return true;
}


function nestingIsFirstAndOnlyInSelectorWithEitherSpaceOrChildCombinator(selector) {
	if (!selector.parent) {
		return false;
	}

	if (selector.parent.nodes.indexOf(selector) !== 0) {
		return false;
	}

	for (let i = 1; i < selector.parent.nodes.length; i++) {
		if (selector.parent.nodes[i].type === 'combinator' && (selector.parent.nodes[i].value !== ' ' && selector.parent.nodes[i].value !== '>')) {
			return false;
		}
	}

	return true;
}

function nestingIsNotInsideCompoundSelector(selector) {
	if (isSimpleSelector(selector)) {
		return true;
	}

	if (!selector.parent) {
		return false;
	}

	for (let i = 0; i < selector.parent.nodes.length; i++) {
		if (!selector.parent.nodes[i].type === 'nesting') {
			continue;
		}

		if (!selector.parent.nodes[i].prev() && !selector.parent.nodes[i].next()) {
			continue;
		}

		if (selector.parent.nodes[i].prev() && selector.parent.nodes[i].prev().type !== 'combinator') {
			return false;
		}

		if (selector.parent.nodes[i].next() && selector.parent.nodes[i].next().type !== 'combinator') {
			return false;
		}
	}

	return true;
}
