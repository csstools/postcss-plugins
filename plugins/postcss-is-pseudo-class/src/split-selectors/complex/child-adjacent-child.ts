// :-csstools-matches(.a > .b) + :-csstools-matches(.c > .d)
// equivalent to
// .a.c > .b + .d
// because adjacent elements have the same parent element.
export function childAdjacentChild(selector): boolean {
	if (!selector || !selector.nodes) {
		return false;
	}
	if (selector.type !== 'selector') {
		return false;
	}

	if (selector.nodes.length !== 3) {
		return false;
	}

	if (!selector.nodes[0] || selector.nodes[0].type !== 'pseudo' || selector.nodes[0].value !== ':-csstools-matches') {
		return false;
	}

	// adjacent combinator
	if (!selector.nodes[1] || selector.nodes[1].type !== 'combinator' || selector.nodes[1].value !== '+') {
		return false;
	}

	if (!selector.nodes[2] || selector.nodes[2].type !== 'pseudo' || selector.nodes[2].value !== ':-csstools-matches') {
		return false;
	}

	// first `:-csstools-matches`
	{
		if (!selector.nodes[0].nodes || selector.nodes[0].nodes.length !== 1) {
			return false;
		}

		if (selector.nodes[0].nodes[0].type !== 'selector') {
			return false;
		}

		if (!selector.nodes[0].nodes[0].nodes || selector.nodes[0].nodes[0].nodes.length !== 3) {
			return false;
		}

		// child combinator
		if (!selector.nodes[0].nodes[0].nodes || selector.nodes[0].nodes[0].nodes[1].type !== 'combinator' || selector.nodes[0].nodes[0].nodes[1].value !== '>') {
			return false;
		}
	}

	// second `:-csstools-matches`
	{
		if (!selector.nodes[2].nodes || selector.nodes[2].nodes.length !== 1) {
			return false;
		}

		if (selector.nodes[2].nodes[0].type !== 'selector') {
			return false;
		}

		if (!selector.nodes[2].nodes[0].nodes || selector.nodes[2].nodes[0].nodes.length !== 3) {
			return false;
		}

		// child combinator
		if (!selector.nodes[2].nodes[0].nodes || selector.nodes[2].nodes[0].nodes[1].type !== 'combinator' || selector.nodes[2].nodes[0].nodes[1].value !== '>') {
			return false;
		}
	}

	selector.nodes[0].nodes[0].insertAfter(selector.nodes[0].nodes[0].nodes[0], selector.nodes[2].nodes[0].nodes[0].clone());
	selector.nodes[2].nodes[0].nodes[1].remove();
	selector.nodes[2].nodes[0].nodes[0].remove();

	selector.nodes[0].replaceWith(selector.nodes[0].nodes[0]);
	selector.nodes[2].replaceWith(selector.nodes[2].nodes[0]);

	return true;
}
