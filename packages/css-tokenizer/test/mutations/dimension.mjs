import assert from 'node:assert';
import { collectTokens } from '../util/collect-tokens.mjs';
import { mutateUnit, tokenizer, stringify } from '@csstools/css-tokenizer';

{
	const token = ['dimension-token', '10px', 0, 4, { value: 10, unit: 'px', type: 'integer', signCharacter: undefined }];
	mutateUnit(token, 'bar');

	assert.deepEqual(
		token,
		['dimension-token', '10bar', 0, 4, { value: 10, unit: 'bar', type: 'integer', signCharacter: undefined }],
	);

	const raw = stringify(token);
	assert.deepEqual(
		raw,
		'10bar',
	);

	const t = tokenizer({
		css: raw,
	});

	assert.deepEqual(
		collectTokens(t),
		[
			['dimension-token', '10bar', 0, 4, { value: 10, unit: 'bar', type: 'integer', signCharacter: undefined }],
			['EOF-token', '', -1, -1, undefined],
		],
	);
}

{
	const token = ['dimension-token', '+10px', 0, 5, { value: 10, unit: 'px', type: 'integer', signCharacter: '+' }];
	mutateUnit(token, 'bar');

	assert.deepEqual(
		token,
		['dimension-token', '+10bar', 0, 5, { value: 10, unit: 'bar', type: 'integer', signCharacter: '+' }],
	);

	const raw = stringify(token);
	assert.deepEqual(
		raw,
		'+10bar',
	);

	const t = tokenizer({
		css: raw,
	});

	assert.deepEqual(
		collectTokens(t),
		[
			['dimension-token', '+10bar', 0, 5, { value: 10, unit: 'bar', type: 'integer', signCharacter: '+' }],
			['EOF-token', '', -1, -1, undefined],
		],
	);
}

{
	const token = ['dimension-token', '-10px', 0, 5, { value: -10, unit: 'px', type: 'integer', signCharacter: '-' }];
	mutateUnit(token, 'bar');

	assert.deepEqual(
		token,
		['dimension-token', '-10bar', 0, 5, { value: -10, unit: 'bar', type: 'integer', signCharacter: '-' }],
	);

	const raw = stringify(token);
	assert.deepEqual(
		raw,
		'-10bar',
	);

	const t = tokenizer({
		css: raw,
	});

	assert.deepEqual(
		collectTokens(t),
		[
			['dimension-token', '-10bar', 0, 5, { value: -10, unit: 'bar', type: 'integer', signCharacter: '-' }],
			['EOF-token', '', -1, -1, undefined],
		],
	);
}

{
	const token = ['dimension-token', '10px', 0, 4, { value: 10, unit: 'px', type: 'integer', signCharacter: undefined }];
	mutateUnit(token, 'e2');

	assert.deepEqual(
		token,
		['dimension-token', '10\\65 2', 0, 4, { value: 10, unit: 'e2', type: 'integer', signCharacter: undefined }],
	);

	const raw = stringify(token);
	assert.deepEqual(
		raw,
		'10\\65 2',
	);

	const t = tokenizer({
		css: raw,
	});

	assert.deepEqual(
		collectTokens(t),
		[
			['dimension-token', '10\\65 2', 0, 6, { value: 10, unit: 'e2', type: 'integer', signCharacter: undefined }],
			['EOF-token', '', -1, -1, undefined],
		],
	);
}

{
	const token = ['dimension-token', '10e2px', 0, 5, { value: 1000, unit: 'px', type: 'number', signCharacter: undefined }];
	mutateUnit(token, 'e2');

	assert.deepEqual(
		token,
		['dimension-token', '1000\\65 2', 0, 5, { value: 1000, unit: 'e2', type: 'number', signCharacter: undefined }],
	);

	const raw = stringify(token);
	assert.deepEqual(
		raw,
		'1000\\65 2',
	);

	const t = tokenizer({
		css: raw,
	});

	assert.deepEqual(
		collectTokens(t),
		[
			['dimension-token', '1000\\65 2', 0, 8, { value: 1000, unit: 'e2', type: 'integer', signCharacter: undefined }],
			['EOF-token', '', -1, -1, undefined],
		],
	);
}
