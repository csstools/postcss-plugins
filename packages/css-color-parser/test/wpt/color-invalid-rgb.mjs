import { color } from '@csstools/css-color-parser';
import assert from 'node:assert';
import { parse } from '../util/parse.mjs';
import { serialize_sRGB_data } from '../util/serialize.mjs';

const tests = [
	['rgb(none, none, none)', 'The none keyword is invalid in legacy color syntax'],
	['rgba(none, none, none, none)', 'The none keyword is invalid in legacy color syntax'],
	['rgb(128, 0, none)', 'The none keyword is invalid in legacy color syntax'],
	['rgb(255, 255, 255, none)', 'The none keyword is invalid in legacy color syntax'],

	['rgb(10%, 50%, 0)', 'Values must be all numbers or all percentages'],
	['rgb(255, 50%, 0%)', 'Values must be all numbers or all percentages'],
	['rgb(0, 0 0)', 'Comma optional syntax requires no commas at all'],
	['rgb(0, 0, 0deg)', 'Angles are not accepted in the rgb function'],
	['rgb(0, 0, light)', 'Keywords are not accepted in the rgb function'],
	['rgb()', 'The rgb function requires 3 or 4 arguments'],
	['rgb(0)', 'The rgb function requires 3 or 4 arguments'],
	['rgb(0, 0)', 'The rgb function requires 3 or 4 arguments'],
	['rgb(0%)', 'The rgb function requires 3 or 4 arguments'],
	['rgb(0%, 0%)', 'The rgb function requires 3 or 4 arguments'],
	['rgba(10%, 50%, 0, 1)', 'Values must be all numbers or all percentages'],
	['rgba(255, 50%, 0%, 1)', 'Values must be all numbers or all percentages'],
	['rgba(0, 0, 0 0)', 'Comma optional syntax requires no commas at all'],
	['rgba(0, 0, 0, 0deg)', 'Angles are not accepted in the rgb function'],
	['rgba(0, 0, 0, light)', 'Keywords are not accepted in the rgb function'],
	['rgba()', 'The rgba function requires 3 or 4 arguments'],
	['rgba(0)', 'The rgba function requires 3 or 4 arguments'],
	['rgba(0, 0, 0, 0, 0)', 'The rgba function requires 3 or 4 arguments'],
	['rgba(0%)', 'The rgba function requires 3 or 4 arguments'],
	['rgba(0%, 0%)', 'The rgba function requires 3 or 4 arguments'],
	['rgba(0%, 0%, 0%, 0%, 0%)', 'The rgba function requires 3 or 4 arguments'],
];

for (const test of tests) {
	assert.deepStrictEqual(
		serialize_sRGB_data(color(parse(test[0]))),
		'',
	);
}
