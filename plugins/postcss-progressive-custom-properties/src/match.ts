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
		for (let i = 0; i < a.nodes.length; i++) {
			let ia = i;
			let ib = i;

			while (a.nodes[ia] && a.nodes[ia].type === 'space') {
				ia++;
			}

			while (b.nodes[ib] && b.nodes[ib].type === 'space') {
				ib++;
			}

			if (!!a.nodes[ia] !== !!b.nodes[ib]) {
				return false;
			}

			if (!matches(a.nodes[ia], b.nodes[ib])) {
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

	if (a.type === 'string') {
		if (a.value !== b.value) {
			return true;
		}

		return false;
	}

	if (a.value.toLowerCase() !== b.value.toLowerCase()) {
		return true;
	}

	return false;
}
