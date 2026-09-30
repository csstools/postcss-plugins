import fs from 'fs';

import { color, computedValue } from '@csstools/css-color-parser';
import { parse } from './parse.mjs';
import { matchOriginalPrecision } from './serialize.mjs';

/**
 * Rewrite WPT computed value tests for CSS Color
 *
 * Usage: node packages/css-color-parser/test/util/update-wpt.mjs
 *
 * This script reads from stdin and writes to stdout.
 * So you can for example copy the contents of a WPT test file and run:
 * `pbpaste | node packages/css-color-parser/test/util/update-wpt.mjs | pbcopy`
 * And then paste the result back into the WPT test file.
 *
 * Setup:
 * - `npm install`
 *
 * Making changes:
 * - the color parser is located in `packages/css-color-parser/src`
 * - color conversion helpers are located in `packages/color-helpers/src`
 * - calc and math related functions are located in `packages/css-calc/src`
 * - run `npm run build` after each change
 *
 * Individual cases can also be tested with: https://preset-env.cssdb.org/color/computed/
 */

let output = fs.readFileSync(0, 'utf-8');

{
	const fuzzy_test_computed_color_backtick = /fuzzy_test_computed_color\(`([^`]*)`, `([^`]*)`/g;

	output = output.replaceAll(fuzzy_test_computed_color_backtick, (a, b, c) => {
		let result;
		try {
			result = matchOriginalPrecision(computedValue(color(parse(b))), c);
		} catch {
			return a;
		}

		if (!result) {
			return a;
		}

		return `fuzzy_test_computed_color(\`${b}\`, \`${(result)}\``;
	});
}

{
	const test_computed_value_double_quote = /test_computed_value\("([^"]*)", "([^"]*)", "([^"]*)"/g;

	output = output.replaceAll(test_computed_value_double_quote, (a, b, c) => {
		let result;
		try {
			result = matchOriginalPrecision(computedValue(color(parse(b))), c);
		} catch {
			return a;
		}

		if (!result) {
			return a;
		}

		return `test_computed_value("${b}", "${c}", "${(result)}"`;
	});
}

{
	const array_notation_computed_args_double_quote = /\["([^"]*)", "([^"]*)"/g;

	output = output.replaceAll(array_notation_computed_args_double_quote, (a, b, c) => {
		let result;
		try {
			result = matchOriginalPrecision(computedValue(color(parse(b))), c);
		} catch {
			return a;
		}

		if (!result) {
			return a;
		}

		return `["${b}", "${(result)}"`;
	});
}

{
	const array_notation_computed_args_single_quote = /\['([^']*)', '([^']*)'/g;

	output = output.replaceAll(array_notation_computed_args_single_quote, (a, b, c) => {
		let result;
		try {
			result = matchOriginalPrecision(computedValue(color(parse(b))), c);
		} catch {
			return a;
		}

		if (!result) {
			return a;
		}

		return `['${b}', '${(result)}'`;
	});
}

process.stdout.write(output);
