import test from 'node:test';
import assert from 'node:assert';
import { parseFunctionParameters } from '@csstools/custom-function-parser';
import { parseListOfComponentValues } from '@csstools/css-parser-algorithms';
import { tokenize } from '@csstools/css-tokenizer';

function parseParameters(css) {
	return parseFunctionParameters(parseListOfComponentValues(tokenize({ css })));
}

test('parseFunctionParameters trailing trivia', async (t) => {
	await t.test('keeps a default value when the trailing comma is followed by whitespace', () => {
		const parameters = parseParameters('--a: 1px, ');
		assert.ok(parameters);

		assert.strictEqual(parameters[0].getDefaultValue(), '1px');
		assert.strictEqual(parameters[0].after.length, 1);
	});

	await t.test('keeps a default value when the trailing comma is followed by a comment', () => {
		const parameters = parseParameters('--a: 1px, /* a comment */');
		assert.ok(parameters);

		assert.strictEqual(parameters[0].getDefaultValue(), '1px');
	});

	await t.test('unwraps a braced default value before a trailing comma and whitespace', () => {
		const parameters = parseParameters('--a: {1px, 2px}, ');
		assert.ok(parameters);

		assert.strictEqual(parameters[0].getDefaultValue(), '1px, 2px');
	});

	await t.test('unwraps a braced default value before a comment and a trailing comma', () => {
		const parameters = parseParameters('--a: {1px, 2px}/* a comment */, ');
		assert.ok(parameters);

		assert.strictEqual(parameters[0].getDefaultValue(), '1px, 2px');
	});

	await t.test('keeps comments in a default value at the end of the list', () => {
		const parameters = parseParameters('--a: 1px /* a comment */');
		assert.ok(parameters);

		assert.strictEqual(parameters[0].getDefaultValue(), '1px /* a comment */');
	});

	await t.test('parses an empty default before a trailing comma', () => {
		const parameters = parseParameters('--a:, ');
		assert.ok(parameters);

		assert.strictEqual(parameters[0].colon === null, false);
		assert.strictEqual(parameters[0].getDefaultValue(), '');
	});

	await t.test('rejects an unmatched close token in a braced default', () => {
		assert.strictEqual(parseParameters('--a: {)})'), false);
	});
});

test('parseFunctionParameters names', async (t) => {
	await t.test('treats custom property names as case-sensitive', () => {
		const parameters = parseParameters('--a, --A');
		assert.ok(parameters);

		assert.deepEqual(parameters.map((parameter) => parameter.getName()), ['--a', '--A']);
	});

	await t.test('rejects a duplicate name', () => {
		assert.strictEqual(parseParameters('--a, --a'), false);
	});

	await t.test('rejects leading and double commas', () => {
		assert.strictEqual(parseParameters(', --a'), false);
		assert.strictEqual(parseParameters('--a,,--b'), false);
	});
});
