import fs from 'fs';

import { computedValue, reducePrecisionWholeValue } from './serialize.mjs';

const input = fs.readFileSync(0, 'utf-8');

let output = input;

const array_notation_computed_args_single_quote = /\['([^']*)', '([^']*)'/g;

output = output.replaceAll(array_notation_computed_args_single_quote, (a, b) => {
	const result = reducePrecisionWholeValue(computedValue(b));
	if (!result) {
		return a;
	}

	return `['${b}', '${(result)}'`;
});

process.stdout.write(output);

