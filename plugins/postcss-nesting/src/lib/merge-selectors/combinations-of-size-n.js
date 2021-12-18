export function combinationsWithSizeN(set, n) {
	if (n < 2) {
		throw new Error('n must be greater than 1');
	}

	if (set.length < 2) {
		throw new Error('s must be greater than 1');
	}

	if (Math.pow(set.length, n) > 10000) {
		throw new Error(`too many combinations for ${set} with size ${n}`);
	}

	const counters = [];

	for (let i = 0; i < n; i++) {
		counters[i] = 0;
	}

	const result = [];

	// eslint-disable-next-line no-constant-condition
	while (true) {
		const ss = [];
		for (let i = n-1; i >=0; i--) {
			let currentCounter = counters[i];
			if (currentCounter >= set.length) {
				currentCounter = 0;
				counters[i] = 0;

				if (i === 0) {
					return result;
				} else {
					counters[i-1] += 1;
				}
			}

			ss[i] = set[currentCounter];
		}

		result.push(ss);
		counters[counters.length -1]++;
	}
}
