import test from 'node:test';
import assert from 'node:assert';
import { isFunctionNode, parseComponentValue, stringify } from '@csstools/css-parser-algorithms';
import { tokenize } from '@csstools/css-tokenizer';
import { parseDashedFunctionArguments } from '@csstools/custom-function-parser';

function parseArguments(css) {
	const fn = parseComponentValue(tokenize({ css }));
	assert.ok(isFunctionNode(fn));

	return parseDashedFunctionArguments(fn.value);
}

function stringified(css) {
	const args = parseArguments(css);
	assert.ok(args);

	return args.map((argument) => stringify([argument]));
}

test('parseDashedFunctionArguments declaration values', async (t) => {
	await t.test('rejects unmatched close tokens', () => {
		assert.strictEqual(parseArguments('--a(})'), false);
		assert.strictEqual(parseArguments('--a(])'), false);
	});

	await t.test('rejects bad strings and bad urls', () => {
		assert.strictEqual(parseArguments('--a("unterminated\n)'), false);
		assert.strictEqual(parseArguments('--a(url(\\\n))'), false);
	});

	await t.test('rejects special tokens at the top level', () => {
		assert.strictEqual(parseArguments('--a(;)'), false);
		assert.strictEqual(parseArguments('--a(!)'), false);
	});

	await t.test('rejects forbidden tokens in a {}-wrapped argument', () => {
		assert.strictEqual(parseArguments('--a({red !important})'), false);
		assert.strictEqual(parseArguments('--a(123 {})'), false);
	});

	await t.test('allows forbidden tokens inside nested blocks', () => {
		assert.deepEqual(stringified('--a({[;]})'), ['[;]']);
	});

	await t.test('rejects unmatched close tokens inside a {}-wrapped argument', () => {
		assert.strictEqual(parseArguments('--a({)})'), false);
	});
});

test('parseDashedFunctionArguments empty arguments', async (t) => {
	await t.test('drops a single empty argument', () => {
		assert.deepEqual(stringified('--a()'), []);
		assert.deepEqual(stringified('--a( )'), []);
		assert.deepEqual(stringified('--a(/* a comment */)'), []);
	});

	await t.test('parses empty arguments around commas', () => {
		assert.deepEqual(stringified('--a(,)'), ['']);
		assert.deepEqual(stringified('--a(,,)'), ['', '']);
		assert.deepEqual(stringified('--a(1,,)'), ['1', '']);
	});

	await t.test('drops a trailing comma', () => {
		assert.deepEqual(stringified('--a(1,)'), ['1']);
		assert.deepEqual(stringified('--a(1, )'), ['1']);
		assert.deepEqual(stringified('--a(1, /* a comment */)'), ['1']);
	});

	await t.test('trims whitespace but keeps comments', () => {
		assert.deepEqual(stringified('--a( 1px )'), ['1px']);
		assert.deepEqual(stringified('--a(/* a comment */ 1px)'), ['/* a comment */ 1px']);
		assert.deepEqual(stringified('--a(1px /* a comment */)'), ['1px /* a comment */']);
	});
});
