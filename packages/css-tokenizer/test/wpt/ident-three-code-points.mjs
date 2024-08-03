import { tokenizer } from '@csstools/css-tokenizer';
import assert from 'node:assert';
import { collectTokens } from '../util/collect-tokens.mjs';

{
	const t = tokenizer({
		css: '#1',
	});

	assert.deepEqual(
		collectTokens(t),
		[
			['hash-token', '#1', 0, 1, { value: '1', type: 'unrestricted' }],
			['EOF-token', '', -1, -1, undefined],
		],
	);
}

{
	const t = tokenizer({
		css: '#-2',
	});

	assert.deepEqual(
		collectTokens(t),
		[
			[
				'hash-token',
				'#-2',
				0,
				2,
				{ value: '-2', type: 'unrestricted' },
			],
			['EOF-token', '', -1, -1, undefined],
		],
	);
}

{
	const t = tokenizer({
		css: '#--3',
	});

	assert.deepEqual(
		collectTokens(t),
		[
			['hash-token', '#--3', 0, 3, { value: '--3', type: 'id' }],
			['EOF-token', '', -1, -1, undefined],
		],
	);
}

{
	const t = tokenizer({
		css: '#---4',
	});

	assert.deepEqual(
		collectTokens(t),
		[
			['hash-token', '#---4', 0, 4, { value: '---4', type: 'id' }],
			['EOF-token', '', -1, -1, undefined],
		],
	);
}

{
	const t = tokenizer({
		css: '#a',
	});

	assert.deepEqual(
		collectTokens(t),
		[
			['hash-token', '#a', 0, 1, { value: 'a', type: 'id' }],
			['EOF-token', '', -1, -1, undefined],
		],
	);
}

{
	const t = tokenizer({
		css: '#-b',
	});

	assert.deepEqual(
		collectTokens(t),
		[
			['hash-token', '#-b', 0, 2, { value: '-b', type: 'id' }],
			['EOF-token', '', -1, -1, undefined],
		],
	);
}

{
	const t = tokenizer({
		css: '#--c',
	});

	assert.deepEqual(
		collectTokens(t),
		[
			['hash-token', '#--c', 0, 3, { value: '--c', type: 'id' }],
			['EOF-token', '', -1, -1, undefined],
		],
	);
}

{
	const t = tokenizer({
		css: '#---d',
	});

	assert.deepEqual(
		collectTokens(t),
		[
			['hash-token', '#---d', 0, 4, { value: '---d', type: 'id' }],
			['EOF-token', '', -1, -1, undefined],
		],
	);
}
