import parser from 'postcss-selector-parser';

const isPseudo = parser.pseudo({ value: ':is' });

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

export default function mergeSelectors(fromSelectors, toSelectors) {
	const fromListHasUniformSpecificity = equallySpecific(fromSelectors);

	let fromSelectorsAST = [];

	if (fromListHasUniformSpecificity) {
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
						wrapMultipleTagSelectorsWithIsPseudo(parent);
					}

					return;
				}

				if (fromIsSimple || fromIsCompound) {
					const parent = nesting.parent;
					nesting.replaceWith(fromSelectorAST.clone().nodes[0]);

					if (parent) {
						sortCompoundSelectorsInsideComplexSelector(parent);
					}

					return;
				}

				if (nestingIsFirstAndOnlyInSelectorWithEitherSpaceOrChildCombinator(nesting)) {
					const parent = nesting.parent;
					nesting.replaceWith(...(fromSelectorAST.clone().nodes));

					if (parent) {
						sortCompoundSelectorsInsideComplexSelector(parent);
					}

					return;
				}

				if (nestingIsNotInsideCompoundSelector(nesting)) {
					const parent = nesting.parent;
					nesting.replaceWith(...(fromSelectorAST.clone().nodes));

					if (parent) {
						sortCompoundSelectorsInsideComplexSelector(parent);
					}

					return;
				}

				const parent = nesting.parent;
				nesting.replaceWith(...(fromSelectorWithIsAST.clone().nodes));

				if (parent) {
					sortCompoundSelectorsInsideComplexSelector(parent);
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
				compoundSelector.replaceWith(...(compoundSelector.nodes));
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

function equallySpecific(nodes) {
	const specificities = nodes.map((node) => {
		return parser().astSync(node);
	}).map((ast) => {
		return selectorSpecificity(ast);
	});

	const first = specificities[0];
	for (let i = 1; i < specificities.length; i++) {
		if (first.a === specificities[i].a && first.b === specificities[i].b && first.c === specificities[i].c) {
			continue;
		}

		return false;
	}

	return true;
}

function selectorSpecificity(node) {
	let a = 0;
	let b = 0;
	let c = 0;

	if (node.type === 'id') {
		a += 1;
	} else if (node.type === 'tag') {
		c += 1;
	} else if (node.type === 'class') {
		b += 1;
	} else if (node.type === 'attribute') {
		b += 1;
	} else if (node.type === 'pseudo') {
		switch (node.value) {
			case '::after':
			case ':after':
			case '::backdrop':
			case '::before':
			case ':before':
			case '::cue':
			case '::cue-region':
			case '::first-letter':
			case ':first-letter':
			case '::first-line':
			case ':first-line':
			case '::file-selector-button':
			case '::grammar-error':
			case '::marker':
			case '::part':
			case '::placeholder':
			case '::selection':
			case '::slotted':
			case '::spelling-error':
			case '::target-text':
				c += 1;
				break;

			case ':is':
			case ':has':
			case ':not':
				{
					const pseudoSpecificity = selectorSpecificity(node.nodes[0]);
					a += pseudoSpecificity.a;
					b += pseudoSpecificity.b;
					c += pseudoSpecificity.c;
					break;
				}

			case 'where':
				break;

			case ':nth-child':
			case ':nth-last-child':
				{
					const ofSeperatorIndex = node.nodes.findIndex((x) => {
						x.value === 'of';
					});

					if (ofSeperatorIndex > -1) {
						const ofSpecificity = selectorSpecificity(parser.selector({ nodes: node.nodes.slice(ofSeperatorIndex + 1) }));
						a += ofSpecificity.a;
						b += ofSpecificity.b;
						c += ofSpecificity.c;
					} else {
						a += a;
						b += b;
						c += c;
					}
				}
				break;

			default:
				b += 1;
		}
	} else if (node.nodes && node.nodes.length > 0) {
		node.nodes.forEach((child) => {
			const specificity = selectorSpecificity(child);
			a += specificity.a;
			b += specificity.b;
			c += specificity.c;
		});
	}

	return {
		a,
		b,
		c,
	};
}

function combinationsWithSizeN(set, n) {
	if (n < 2) {
		throw new Error('n must be greater than 1');
	}

	if (set.length < 2) {
		throw new Error('s must be greater than 1');
	}

	if (Math.pow(set.length, n) > 10000) {
		throw new Error(`too many combinations for ${set} with size ${n}`);
	}

	const counters = [];

	for (let i = 0; i < n; i++) {
		counters[i] = 0;
	}

	const result = [];

	// eslint-disable-next-line no-constant-condition
	while (true) {
		const ss = [];
		for (let i = n-1; i >=0; i--) {
			let currentCounter = counters[i];
			if (currentCounter >= set.length) {
				currentCounter = 0;
				counters[i] = 0;

				if (i === 0) {
					return result;
				} else {
					counters[i-1] += 1;
				}
			}

			ss[i] = set[currentCounter];
		}

		result.push(ss);
		counters[counters.length -1]++;
	}
}
