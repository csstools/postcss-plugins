type MatcherNode = {
	type: string,
	value?: string,
	nodes?: Array<MatcherNode>,
	dimension?: {
		unit?: string
	},
	isVariable?: boolean,
	anyRemainingArguments?: boolean
}

export function matches(a: MatcherNode, b: MatcherNode): boolean {
	if (
		a.isVariable &&
		(
			!!b && (
				b.type === 'word' ||
				b.type === 'string' ||
				b.type === 'function'
			)
		)
	) {
		return true;
	}

	if (a.type !== b.type) {
		return false;
	}

	if (doesNotMatchValue(a, b)) {
		return false;
	}

	if (a.nodes && b.nodes) {
		for (let i = 0; i < Math.max(a.nodes.length, b.nodes.length); i++) {
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

			if (a.nodes[ia].anyRemainingArguments && b.nodes[ib]) {
				return true;
			}

			if (matches(a.nodes[ia], b.nodes[ib])) {
				continue;
			}

			return false;
		}

		return true;
	}

	return true;
}

function doesNotMatchValue(a: MatcherNode, b: MatcherNode): boolean {
	if (
		a.type === 'space' && b.type === 'space' &&
		a.value?.trim() === b.value?.trim()
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

	if (a.value?.toLowerCase() !== b.value?.toLowerCase()) {
		return true;
	}

	return false;
}
