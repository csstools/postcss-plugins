export function intOrZero(x) {
	const y = parseInt(x, 10);
	if (Number.isNaN(y)) {
		return 0;
	}

	return y;
}
