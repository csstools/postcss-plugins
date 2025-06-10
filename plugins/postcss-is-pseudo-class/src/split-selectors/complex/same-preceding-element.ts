import type { Pseudo } from 'postcss-selector-parser';

import parser from 'postcss-selector-parser';

// .a > :-csstools-matches(.b > .c)
// equivalent to
// .a.b > .c
//
// and
//
// .a + :-csstools-matches(.b + .c)
// equivalent to
// .a.b + .c
//
// because adjacent elements have the same parent element.
export function samePrecedingElement(selector: parser.Container): boolean {
	if (!selector || !selector.nodes) {
		return false;
	}
	if (selector.type !== 'selector') {
		return false;
	}

	let combinatorIndex = -1;
	for (let i = 0; i < selector.nodes.length; i++) {
		const node = selector.nodes[i];
		if (parser.isCombinator(node)) {
			combinatorIndex = i;
			break;
		}

		if (parser.isPseudoElement(node)) {
			return false;
		}
	}

	if (combinatorIndex === -1) {
		return false;
	}

	const isPseudoIndex = combinatorIndex + 1;

	// immediate sibling/child combinator
	if (!selector.nodes[combinatorIndex] || selector.nodes[combinatorIndex].type !== 'combinator' || (selector.nodes[combinatorIndex].value !== '>' && selector.nodes[combinatorIndex].value !== '+')) {
		return false;
	}

	const combinator = selector.nodes[combinatorIndex].value;

	if (!selector.nodes[isPseudoIndex] || selector.nodes[isPseudoIndex].type !== 'pseudo' || selector.nodes[isPseudoIndex].value !== ':-csstools-matches') {
		return false;
	}

	// second `:-csstools-matches`
	{
		if (!selector.nodes[isPseudoIndex].nodes || selector.nodes[isPseudoIndex].nodes.length !== 1) {
			return false;
		}

		if (selector.nodes[isPseudoIndex].nodes[0].type !== 'selector') {
			return false;
		}

		if (!selector.nodes[isPseudoIndex].nodes[0].nodes || selector.nodes[isPseudoIndex].nodes[0].nodes.length !== 3) {
			return false;
		}

		// same combinator
		if (!selector.nodes[isPseudoIndex].nodes[0].nodes || selector.nodes[isPseudoIndex].nodes[0].nodes[1].type !== 'combinator' || selector.nodes[isPseudoIndex].nodes[0].nodes[1].value !== combinator) {
			return false;
		}
	}

	const isPseudo = selector.nodes[isPseudoIndex];
	if (!isPseudo || !parser.isPseudoClass(isPseudo)) {
		return false;
	}

	const before = selector.nodes.slice(0, combinatorIndex);

	selector.each((node) => {
		node.remove();
	});

	before.forEach((node) => {
		selector.append(node);
	});

	isPseudo.nodes[0].nodes.forEach((node) => {
		selector.append(node);
	});

	return true;
}
