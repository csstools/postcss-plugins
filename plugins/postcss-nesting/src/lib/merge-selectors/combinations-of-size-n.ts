export function combinationsWithSizeN(set: Array<string>, n: number): Array<Array<string>> {
	// set is the list of parent selectors
	// n is the amount of `&` selectors in the current selector.
	// all combinations of values in the set with an array size of n must be generated to match the nesting selector behavior.
	//
	// for example :
	// a current selector like: `& + & {}`
	// with parent : `.foo, .bar {}`
	//
	// the set is `['.foo', '.bar']` and n is 2, the resulting combinations are:
	// ['.foo', '.bar']
	// ['.foo', '.foo']
	// ['.bar', '.foo']
	// ['.bar', '.bar']
	//
	// outputted like :
	// .foo + .bar,
	// .foo + .foo,
	// .bar + .foo,
	// .bar + .bar {}


	if (n < 2) {
		// should never happen and is checked by caller
		throw new Error('n must be greater than 1');
	}

	if (set.length < 2) {
		// should never happen and is checked by caller
		throw new Error('s must be greater than 1');
	}

	if (Math.pow(set.length, n) > 10000) {
		// Throwing is best here as a warning would be impossible to handle gracefully on our end.
		// This will error mid transform and there is no possible fallback at this point.
		// The user should reduce complexity.
		throw new Error('Too many combinations when trying to resolve a nested selector with lists, reduce the complexity of your selectors');
	}

	const counters: Array<number> = [];

	for (let i = 0; i < n; i++) {
		counters[i] = 0;
	}

	const result: Array<Array<string>> = [];

	// eslint-disable-next-line no-constant-condition
	while (true) {
		const ss : Array<string> = [];
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
