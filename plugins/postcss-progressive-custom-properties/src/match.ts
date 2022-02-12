export function matches(a, b) {
	if (a.isVariable && !!b) {
		return true;
	}

	if (a.type !== b.type) {
		return false;
	}

	if (doesNotMatchValue(a, b)) {
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

function doesNotMatchValue(a, b) {
	if (
		a.type === 'space' && b.type === 'space' &&
		a.value.trim() === b.value.trim()
	) {
		return false;
	}

	if (a.dimension && b.dimension) {
		return a.dimension.unit !== b.dimension.unit;
	}

	if (a.value !== b.value) {
		return true;
	}

	return false;
}
