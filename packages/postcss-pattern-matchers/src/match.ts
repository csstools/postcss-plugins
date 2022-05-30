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
		let ia = 0;
		let ib = 0;

		while (a.nodes[ia] || b.nodes[ib]) {
			if (!!a.nodes[ia] !== !!b.nodes[ib]) {
				return false;
			}

			while (a.nodes[ia] && (a.nodes[ia].type === 'space' || a.nodes[ia].type === 'comment')) {
				ia++;
			}

			while (b.nodes[ib] && (b.nodes[ib].type === 'space' || b.nodes[ib].type === 'comment')) {
				ib++;
			}

			if (!matches(a.nodes[ia], b.nodes[ib])) {
				return false;
			}

			ia++;
			ib++;
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

	if (a.dimension && a.dimension.isVariable) {
		return false;
	}

	if (a.value !== b.value) {
		return true;
	}

	return false;
}
