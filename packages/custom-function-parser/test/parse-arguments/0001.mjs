import test from 'node:test';
import assert from 'node:assert';
import { isFunctionNode, parseComponentValue, stringify } from '@csstools/css-parser-algorithms';
import { tokenize } from '@csstools/css-tokenizer';
import { parseDashedFunctionArguments } from '@csstools/custom-function-parser';

function parseArguments(css) {
	const fn = parseComponentValue(tokenize({ css }));
	assert.ok(isFunctionNode(fn));

	return parseDashedFunctionArguments(fn);
}

function stringified(css) {
	const args = parseArguments(css);
	assert.ok(args);

	return args.map((argument) => stringify([argument]));
}

test('parseDashedFunctionArguments', async (t) => {
	await t.test('parses an argument list', () => {
		assert.deepEqual(stringified('--a(red, blue)'), ['red', 'blue']);
	});

	await t.test('handles empty and trailing commas', () => {
		assert.deepEqual(stringified('--a()'), []);
		assert.deepEqual(stringified('--a( )'), []);
		assert.deepEqual(stringified('--a(red,)'), ['red']);
	});

	await t.test('unwraps a single braced argument', () => {
		assert.deepEqual(stringified('--a({red, blue})'), ['red, blue']);
	});

	await t.test('rejects invalid declaration values', () => {
		assert.equal(parseArguments('--a(red !important)'), false);
		assert.equal(parseArguments('--a(red;blue)'), false);
		assert.equal(parseArguments('--a(red {blue})'), false);
	});
});
