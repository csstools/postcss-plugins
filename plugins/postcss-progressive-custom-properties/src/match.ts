export function matches(a, b) {
	if (a.isVariable && !!b) {
		return true;
	}

	if (a.type !== b.type) {
		return false;
	}

	if (
		a.type === 'space' && b.type === 'space' &&
		a.value.trim() === b.value.trim()
	) {
		// do nothing. values are equal, different amounts of spaces are equal
	} else if (a.value !== b.value) {
		return false;
	}

	if (a.nodes && b.nodes) {
		if (a.nodes.length !== b.nodes.length) {
			return false;
		}

		for (let i = 0; i < a.nodes.length; i++) {
			if (!matches(a.nodes[i], b.nodes[i])) {
				return false;
			}
		}

		return true;
	}

	return true;
}
