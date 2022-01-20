// Some patterns can be detected and converted.
// This is very difficult to abstract, so best to handle this case by case on request.

// :is(.a > .b) + :is(.c > .d)
// equivalent to
// .a.c > .b + .d
// because a adjacent elements have the same parent element.
export function childAdjacentChild(selector) {
	if (!selector || !selector.nodes) {
		return;
	}
	if (selector.type !== 'selector') {
		return;
	}

	if (selector.nodes.length !== 3) {
		return;
	}

	if (!selector.nodes[0] || selector.nodes[0].type !== 'pseudo' || selector.nodes[0].value !== ':is') {
		return;
	}

	// adjacent combinator
	if (!selector.nodes[1] || selector.nodes[1].type !== 'combinator' || selector.nodes[1].value !== '+') {
		return;
	}

	if (!selector.nodes[2] || selector.nodes[2].type !== 'pseudo' || selector.nodes[2].value !== ':is') {
		return;
	}

	// first `:is`
	{
		if (!selector.nodes[0].nodes || selector.nodes[0].nodes.length !== 1) {
			return;
		}

		if (selector.nodes[0].nodes[0].type !== 'selector') {
			return;
		}

		if (!selector.nodes[0].nodes[0].nodes || selector.nodes[0].nodes[0].nodes.length !== 3) {
			return;
		}

		// child combinator
		if (!selector.nodes[0].nodes[0].nodes || selector.nodes[0].nodes[0].nodes[1].type !== 'combinator' || selector.nodes[0].nodes[0].nodes[1].value !== '>') {
			return;
		}
	}

	// second `:is`
	{
		if (!selector.nodes[2].nodes || selector.nodes[2].nodes.length !== 1) {
			return;
		}

		if (selector.nodes[2].nodes[0].type !== 'selector') {
			return;
		}

		if (!selector.nodes[2].nodes[0].nodes || selector.nodes[2].nodes[0].nodes.length !== 3) {
			return;
		}

		// child combinator
		if (!selector.nodes[2].nodes[0].nodes || selector.nodes[2].nodes[0].nodes[1].type !== 'combinator' || selector.nodes[2].nodes[0].nodes[1].value !== '>') {
			return;
		}
	}

	selector.nodes[0].nodes[0].insertAfter(selector.nodes[0].nodes[0].nodes[0], selector.nodes[2].nodes[0].nodes[0].clone());
	selector.nodes[2].nodes[0].nodes[1].remove();
	selector.nodes[2].nodes[0].nodes[0].remove();
}
