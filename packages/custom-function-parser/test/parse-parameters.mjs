import test from 'node:test';
import assert from 'node:assert';
import { parseFunctionParameters } from '@csstools/custom-function-parser';
import { parseListOfComponentValues } from '@csstools/css-parser-algorithms';
import { tokenize } from '@csstools/css-tokenizer';

function parseParameters(css) {
	return parseFunctionParameters(parseListOfComponentValues(tokenize({ css })));
}

test('parseFunctionParameters', async (t) => {
	await t.test('parses names and defaults', () => {
		const parameters = parseParameters('--a, --b: 1px');
		assert.ok(parameters);

		assert.deepEqual(parameters.map((parameter) => parameter.getName()), ['--a', '--b']);
		assert.equal(parameters[0].colon, null);
		assert.equal(parameters[1].getDefaultValue(), '1px');
	});

	await t.test('parses types and empty defaults', () => {
		const parameters = parseParameters('--a <length>, --b:');
		assert.ok(parameters);

		assert.equal(parameters[0].getArgumentType(), '<length>');
		assert.equal(parameters[0].colon, null);
		assert.notEqual(parameters[1].colon, null);
		assert.equal(parameters[1].getDefaultValue(), '');
	});

	await t.test('rejects invalid parameter lists', () => {
		assert.equal(parseParameters('--'), false);
		assert.equal(parseParameters('--a: red !important'), false);
		assert.equal(parseParameters('--a: red;'), false);
		assert.equal(parseParameters('--a, --a'), false);
	});
});
