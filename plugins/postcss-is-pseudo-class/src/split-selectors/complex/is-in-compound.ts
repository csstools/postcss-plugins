import parser from 'postcss-selector-parser';

// .a:-csstools-matches(.b > .c)
// equivalent to
// .b > .c.a
//
// :-csstools-matches(.b > .c).a
// equivalent to
// .b > .c.a
//
// because `:-csstools-matches()` matches the final element of the selector,
export function isInCompoundWithOneOtherElement(selector): boolean {
	if (!selector || !selector.nodes) {
		return false;
	}
	if (selector.type !== 'selector') {
		return false;
	}

	if (selector.nodes.length !== 2) {
		return false;
	}

	let isPseudoIndex;
	let simpleSelectorIndex;
	if (selector.nodes[0] && selector.nodes[0].type === 'pseudo' && selector.nodes[0].value === ':-csstools-matches') {
		isPseudoIndex = 0;
		simpleSelectorIndex = 1;
	} else if (selector.nodes[1] && selector.nodes[1].type === 'pseudo' && selector.nodes[1].value === ':-csstools-matches') {
		isPseudoIndex = 1;
		simpleSelectorIndex = 0;
	}

	if (!isPseudoIndex) {
		return false;
	}

	if (!selector.nodes[simpleSelectorIndex]) {
		return false;
	}

	if (selector.nodes[simpleSelectorIndex].type === 'selector') {
		if (selector.nodes[simpleSelectorIndex].some((x) => {
			return x.type === 'combinator' || parser.isPseudoElement(x);
		})) {
			return false;
		}
	}

	selector.nodes[isPseudoIndex].append(selector.nodes[simpleSelectorIndex].clone());
	selector.nodes[isPseudoIndex].replaceWith(...selector.nodes[isPseudoIndex].nodes);
	selector.nodes[simpleSelectorIndex].remove();

	return true;
}
