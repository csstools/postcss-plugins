import fs from 'fs';

import { computedValue, reducePrecisionWholeValue } from './serialize.mjs';

const input = fs.readFileSync(0, 'utf-8');

let output = input;

const array_notation_three_args_computed_args_single_quote = /\['([^']*)',\s'([^']*)'(?:,\s'([^']*)')?/g;

output = output.replaceAll(array_notation_three_args_computed_args_single_quote, function(a, b, c, d) {
	if (d) {
		const resultB = reducePrecisionWholeValue(computedValue(b));
		if (!resultB) {
			return a;
		}

		const resultC = reducePrecisionWholeValue(computedValue(b, true));
		if (!resultC) {
			return a;
		}

		return `['${b}', '${(resultB)}', '${(resultC)}'`;
	}

	const result = reducePrecisionWholeValue(computedValue(b));
	if (!result) {
		return a;
	}

	return `['${b}', '${(result)}'`;
});

process.stdout.write(output);

