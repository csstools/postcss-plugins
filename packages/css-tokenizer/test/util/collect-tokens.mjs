export function collectTokens(t) {
	const bag = [];

	while (!t.endOfFile()) {
		bag.push(t.nextToken());
	}

	bag.push(t.nextToken()); // EOF-token

	return bag;
}
