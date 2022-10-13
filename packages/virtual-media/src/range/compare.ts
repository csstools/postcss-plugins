export function compare<T>(a: T, b: T): -1 | 0 | 1 {
	if ((typeof a) !== (typeof b)) {
		return 0;
	}

	if ((typeof a === 'number')) {
		const r = a - (b as number);
		if (r < 0) {
			return -1;
		}

		if (r > 0) {
			return 1;
		}

		return 0;
	}

	if ((typeof a === 'string')) {
		const r = a.localeCompare(b as string);
		if (r < 0) {
			return -1;
		}

		if (r > 0) {
			return 1;
		}

		return 0;
	}

	return 0;
}
