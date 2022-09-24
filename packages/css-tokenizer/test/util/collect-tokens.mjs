export function collectTokens(t) {
	const bag = [];
	// eslint-disable-next-line no-constant-condition
	while (true) {
		bag.push(t.nextToken());

		if (!bag[bag.length - 1]) {
			break;
		}

		if (bag[bag.length - 1][0] === 'EOF-token') {
			break;
		}
	}

	return bag;
}
