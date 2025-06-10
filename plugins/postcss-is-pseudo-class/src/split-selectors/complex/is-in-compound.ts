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
export function isInCompoundWithOneOtherElement(selector: parser.Container): boolean {
	if (!selector || !selector.nodes) {
		return false;
	}

	if (!parser.isSelector(selector)) {
		return false;
	}

	if (selector.nodes.length !== 2) {
		return false;
	}

	let isPseudoIndex: number = -1;
	let simpleSelectorIndex: number = -1;
	if (selector.nodes[0] && parser.isPseudoClass(selector.nodes[0]) && selector.nodes[0].value === ':-csstools-matches') {
		isPseudoIndex = 0;
		simpleSelectorIndex = 1;
	} else if (selector.nodes[1] && parser.isPseudoClass(selector.nodes[1]) && selector.nodes[1].value === ':-csstools-matches') {
		isPseudoIndex = 1;
		simpleSelectorIndex = 0;
	}

	const isPseudo: parser.Node | undefined = selector.nodes[isPseudoIndex];
	if (!isPseudo || !parser.isPseudoClass(isPseudo) || isPseudo.nodes.length !== 1) {
		return false;
	}

	const simpleSelector: parser.Node | undefined = selector.nodes[simpleSelectorIndex];
	if (!simpleSelector) {
		return false;
	}

	if (parser.isCombinator(simpleSelector)) {
		return false;
	}

	if (parser.isPseudoElement(simpleSelector)) {
		return false;
	}

	isPseudo.nodes[0].append(simpleSelector.clone());
	isPseudo.replaceWith(...isPseudo.nodes[0].nodes);
	simpleSelector.remove();

	return true;
}
