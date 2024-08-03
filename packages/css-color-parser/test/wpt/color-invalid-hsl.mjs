import { color } from '@csstools/css-color-parser';
import assert from 'node:assert';
import { parse } from '../util/parse.mjs';
import { serialize_sRGB_data } from '../util/serialize.mjs';

const tests = [
	['hsl(none, none, none)', 'The none keyword is invalid in legacy color syntax'],
	['hsla(none, none, none, none)', 'The none keyword is invalid in legacy color syntax'],
	['hsl(none, 100%, 50%)', 'The none keyword is invalid in legacy color syntax'],
	['hsla(120, 100%, 50%, none)', 'The none keyword is invalid in legacy color syntax'],

	['hsl(10, 50%, 0)', 'The second and third parameters of hsl/hsla must be a percent'],
	['hsl(50%, 50%, 0%)', 'The first parameter of hsl/hsla must be a number or angle'],
	['hsl(0, 0% 0%)', 'Comma optional syntax requires no commas at all'],
	['hsl(0, 0%, light)', 'Keywords are not accepted in the hsl function'],
	['hsl()', 'The hsl function requires 3 or 4 arguments'],
	['hsl(0)', 'The hsl function requires 3 or 4 arguments'],
	['hsl(0, 0%)', 'The hsl function requires 3 or 4 arguments'],
	['hsla(10, 50%, 0, 1)', 'The second and third parameters of hsl/hsla must be a percent'],
	['hsla(50%, 50%, 0%, 1)', 'The first parameter of hsl/hsla must be a number or angle'],
	['hsla(0, 0% 0%, 1)', 'Comma optional syntax requires no commas at all'],
	['hsla(0, 0%, light, 1)', 'Keywords are not accepted in the hsla function'],
	['hsla()', 'The hsla function requires 3 or 4 arguments'],
	['hsla(0)', 'The hsla function requires 3 or 4 arguments'],
	['hsla(0, 0%)', 'The hsla function requires 3 or 4 arguments'],
	['hsla(0, 0%, 0%, 1, 0%)', 'The hsla function requires 3 or 4 arguments'],
];

for (const test of tests) {
	assert.deepStrictEqual(
		serialize_sRGB_data(color(parse(test[0]))),
		'',
	);
}
