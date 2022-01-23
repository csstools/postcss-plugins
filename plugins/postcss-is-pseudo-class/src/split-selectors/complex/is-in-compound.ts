// .a:is(.b > .c)
// equivalent to
// .b > .a.c
// :is(.b > .c).a
// equivalent to
// .b > .a.c
// because `:is`
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

	let isPseudo;
	let simpleSelector;
	if (selector.nodes[0] && selector.nodes[0].type === 'pseudo' && selector.nodes[0].value === ':is') {
		isPseudo = selector.nodes[0];
		simpleSelector = selector.nodes[1];
	} else if (selector.nodes[1] && selector.nodes[1].type === 'pseudo' && selector.nodes[1].value === ':is') {
		isPseudo = selector.nodes[1];
		simpleSelector = selector.nodes[0];
	}

	if (!isPseudo) {
		return false;
	}

	isPseudo.append(simpleSelector.clone());
	selector.replaceWith(isPseudo.nodes);

	return true;
}
