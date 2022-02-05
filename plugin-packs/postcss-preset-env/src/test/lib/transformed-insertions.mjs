import getTransformedInsertions from '../../lib/get-transformed-insertions.mjs';
import assert from 'assert';
import { insertAfterKey, insertBeforeKey, insertOrderKey, pluginKey } from '../../own-keys/keys.mjs';

const labFunctionFixture = {
	'id': 'lab-function',
	'should-not-exist-in-result': true,
};

const hasPseudoFixture = {
	'id': 'has-pseudo-class',
	'should-not-exist-in-result': true,
};

assert.deepEqual(
	cleanResult(getTransformedInsertions(
		[labFunctionFixture, hasPseudoFixture],
		undefined,
		'insertAfter',
	)),
	[],
);

assert.deepEqual(
	cleanResult(getTransformedInsertions(
		[labFunctionFixture, hasPseudoFixture],
		null,
		'insertAfter',
	)),
	[],
);

assert.deepEqual(
	cleanResult(getTransformedInsertions(
		[labFunctionFixture, hasPseudoFixture],
		false,
		'insertAfter',
	)),
	[],
);

assert.deepEqual(
	cleanResult(getTransformedInsertions(
		[labFunctionFixture, hasPseudoFixture],
		'',
		'insertAfter',
	)),
	[],
);

assert.deepEqual(
	cleanResult(getTransformedInsertions(
		[labFunctionFixture, hasPseudoFixture],
		{
			'lab-function': () => { },
		},
		undefined,
	)),
	[],
);

assert.deepEqual(
	cleanResult(getTransformedInsertions(
		[labFunctionFixture, hasPseudoFixture],
		{
			'lab-function': () => { },
		},
		'unknown',
	)),
	[],
);

assert.deepEqual(
	cleanResult(getTransformedInsertions(
		[labFunctionFixture, hasPseudoFixture],
		{
			'unknown': () => { },
		},
		'insertAfter',
	)),
	[],
);

assert.deepEqual(
	cleanResult(getTransformedInsertions(
		[labFunctionFixture, hasPseudoFixture],
		undefined,
		undefined,
	)),
	[],
);

assert.deepEqual(
	cleanResult(getTransformedInsertions(
		[labFunctionFixture, hasPseudoFixture],
		{
			'lab-function': () => { },
		},
		'insertAfter',
	)),
	[
		{
			id: 'lab-function',
			[insertOrderKey]: 0,
			[insertAfterKey]: true,
		},
	],
);

assert.deepEqual(
	cleanResult(getTransformedInsertions(
		[labFunctionFixture, hasPseudoFixture],
		{
			'lab-function': () => { },
		},
		'insertBefore',
	)),
	[
		{
			id: 'lab-function',
			[insertOrderKey]: 0,
			[insertBeforeKey]: true,
		},
	],
);

assert.deepEqual(
	cleanResult(getTransformedInsertions(
		[labFunctionFixture, hasPseudoFixture],
		{
			'lab-function': [
				() => { },
			],
		},
		'insertAfter',
	)),
	[
		{
			id: 'lab-function',
			[insertOrderKey]: 0,
			[insertAfterKey]: true,
		},
	],
);

assert.deepEqual(
	cleanResult(getTransformedInsertions(
		[labFunctionFixture, hasPseudoFixture],
		{
			'lab-function': [
				() => { },
			],
		},
		'insertBefore',
	)),
	[
		{
			id: 'lab-function',
			[insertOrderKey]: 0,
			[insertBeforeKey]: true,
		},
	],
);

assert.deepEqual(
	cleanResult(getTransformedInsertions(
		[labFunctionFixture, hasPseudoFixture],
		{
			'lab-function': [
				() => { },
				() => { },
			],
		},
		'insertAfter',
	)),
	[
		{
			id: 'lab-function',
			[insertOrderKey]: 0,
			[insertAfterKey]: true,
		},
		{
			id: 'lab-function',
			[insertOrderKey]: 1,
			[insertAfterKey]: true,
		},
	],
);

assert.deepEqual(
	cleanResult(getTransformedInsertions(
		[labFunctionFixture, hasPseudoFixture],
		{
			'lab-function': [
				() => { },
				() => { },
			],
		},
		'insertBefore',
	)),
	[
		{
			id: 'lab-function',
			[insertOrderKey]: 0,
			[insertBeforeKey]: true,
		},
		{
			id: 'lab-function',
			[insertOrderKey]: 1,
			[insertBeforeKey]: true,
		},
	],
);

// Enumerables and inherited properties.
class Options {}
Object.defineProperty(Options.prototype, 'lab-function', {
	enumerable: true,
	get: function () {
		return () => { };
	},
});

const options = new Options();
options['has-pseudo-class'] = () => { };

assert.deepEqual(
	cleanResult(getTransformedInsertions(
		[labFunctionFixture, hasPseudoFixture],
		options,
		'insertAfter',
	)),
	[
		{
			id: 'has-pseudo-class',
			[insertAfterKey]: true,
			[insertOrderKey]: 0,
		},
	],
);

function cleanResult(res) {
	return res.map((x) => {
		delete x[pluginKey];
		return x;
	});
}
