import fs from 'fs';

import { reducePrecisionWholeValue } from './serialize.mjs';
import { color, computedValue } from '@csstools/css-color-parser';
import { parse } from './parse.mjs';

const input = fs.readFileSync(0, 'utf-8');

let output = input;

const array_notation_three_args_computed_args_single_quote = /\['([^']*)',\s'([^']*)'(?:,\s'([^']*)')?/g;

output = output.replaceAll(array_notation_three_args_computed_args_single_quote, function(a, b, c, d) {
	if (d) {
		const resultB = reducePrecisionWholeValue(computedValue(color(parse(b))));
		if (!resultB) {
			return a;
		}

		const resultC = reducePrecisionWholeValue(computedValue(color(parse(b)), false));
		if (!resultC) {
			return a;
		}

		return `['${b}', '${(resultB)}', '${(resultC)}'`;
	}

	const result = reducePrecisionWholeValue(computedValue(color(parse(b))));
	if (!result) {
		return a;
	}

	return `['${b}', '${(result)}'`;
});

process.stdout.write(output);

