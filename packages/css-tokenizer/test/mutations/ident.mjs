import assert from 'node:assert';
import { collectTokens } from '../util/collect-tokens.mjs';
import { mutateIdent, tokenizer, stringify } from '@csstools/css-tokenizer';

{
	const token = ['ident-token', 'foo', 0, 2, { value: 'foo' }];
	mutateIdent(token, 'bar');

	assert.deepEqual(
		token,
		['ident-token', 'bar', 0, 2, { value: 'bar' }],
	);

	const raw = stringify(token);
	assert.deepEqual(
		raw,
		'bar',
	);

	const t = tokenizer({
		css: raw,
	});

	assert.deepEqual(
		collectTokens(t),
		[
			['ident-token', 'bar', 0, 2, { value: 'bar' }],
			['EOF-token', '', -1, -1, undefined],
		],
	);
}

{
	const token = ['ident-token', 'foo-bar', 0, 6, { value: 'foo-bar' }];
	mutateIdent(token, 'foo.bar');

	assert.deepEqual(
		token,
		['ident-token', 'foo\\2e bar', 0, 6, { value: 'foo.bar' }],
	);

	const raw = stringify(token);
	assert.deepEqual(
		raw,
		'foo\\2e bar',
	);

	const t = tokenizer({
		css: raw,
	});

	assert.deepEqual(
		collectTokens(t),
		[
			['ident-token', 'foo\\2e bar', 0, 9, { value: 'foo.bar' }],
			['EOF-token', '', -1, -1, undefined],
		],
	);
}

{
	const token = ['ident-token', 'foo', 0, 2, { value: 'foo' }];
	mutateIdent(token, '@foo');

	assert.deepEqual(
		token,
		['ident-token', '\\40 foo', 0, 2, { value: '@foo' }],
	);

	const raw = stringify(token);
	assert.deepEqual(
		raw,
		'\\40 foo',
	);

	const t = tokenizer({
		css: raw,
	});

	assert.deepEqual(
		collectTokens(t),
		[
			['ident-token', '\\40 foo', 0, 6, { value: '@foo' }],
			['EOF-token', '', -1, -1, undefined],
		],
	);
}

{
	const token = ['ident-token', 'foo', 0, 2, { value: 'foo' }];
	mutateIdent(token, '-');

	assert.deepEqual(
		token,
		['ident-token', '\\2d ', 0, 2, { value: '-' }],
	);

	const raw = stringify(token);
	assert.deepEqual(
		raw,
		'\\2d ',
	);

	const t = tokenizer({
		css: raw,
	});

	assert.deepEqual(
		collectTokens(t),
		[
			['ident-token', '\\2d ', 0, 3, { value: '-' }],
			['EOF-token', '', -1, -1, undefined],
		],
	);
}

{
	const token = ['ident-token', '--prop', 0, 2, { value: '--prop' }];
	mutateIdent(token, '--other-prop');

	assert.deepEqual(
		token,
		['ident-token', '--other-prop', 0, 2, { value: '--other-prop' }],
	);

	const raw = stringify(token);
	assert.deepEqual(
		raw,
		'--other-prop',
	);

	const t = tokenizer({
		css: raw,
	});

	assert.deepEqual(
		collectTokens(t),
		[
			['ident-token', '--other-prop', 0, 11, { value: '--other-prop' }],
			['EOF-token', '', -1, -1, undefined],
		],
	);
}

{
	const token = ['ident-token', '--prop', 0, 2, { value: '--prop' }];
	mutateIdent(token, '--%other-prop');

	assert.deepEqual(
		token,
		['ident-token', '--\\25other-prop', 0, 2, { value: '--%other-prop' }],
	);

	const raw = stringify(token);
	assert.deepEqual(
		raw,
		'--\\25other-prop',
	);

	const t = tokenizer({
		css: raw,
	});

	assert.deepEqual(
		collectTokens(t),
		[
			[
				'ident-token',
				'--\\25other-prop',
				0,
				14,
				{ value: '--%other-prop' },
			],
			['EOF-token', '', -1, -1, undefined],
		],
	);
}

{
	const token = ['ident-token', '--prop', 0, 2, { value: '--prop' }];
	mutateIdent(token, '--%a-prop');

	assert.deepEqual(
		token,
		['ident-token', '--\\25 a-prop', 0, 2, { value: '--%a-prop' }],
	);

	const raw = stringify(token);
	assert.deepEqual(
		raw,
		'--\\25 a-prop',
	);

	const t = tokenizer({
		css: raw,
	});

	assert.deepEqual(
		collectTokens(t),
		[
			[
				'ident-token',
				'--\\25 a-prop',
				0,
				11,
				{ value: '--%a-prop' },
			],
			['EOF-token', '', -1, -1, undefined],
		],
	);
}

{
	const token = ['ident-token', '-moz-width', 0, 2, { value: '-moz-width' }];
	mutateIdent(token, '-webkit-width');

	assert.deepEqual(
		token,
		['ident-token', '-webkit-width', 0, 2, { value: '-webkit-width' }],
	);

	const raw = stringify(token);
	assert.deepEqual(
		raw,
		'-webkit-width',
	);

	const t = tokenizer({
		css: raw,
	});

	assert.deepEqual(
		collectTokens(t),
		[
			[
				'ident-token',
				'-webkit-width',
				0,
				12,
				{ value: '-webkit-width' },
			],
			['EOF-token', '', -1, -1, undefined],
		],
	);
}

{
	const token = ['ident-token', '-moz-width', 0, 2, { value: '-moz-width' }];
	mutateIdent(token, '-@webkit-width');

	assert.deepEqual(
		token,
		[
			'ident-token',
			'-\\40webkit-width',
			0,
			2,
			{ value: '-@webkit-width' },
		],
	);

	const raw = stringify(token);
	assert.deepEqual(
		raw,
		'-\\40webkit-width',
	);

	const t = tokenizer({
		css: raw,
	});

	assert.deepEqual(
		collectTokens(t),
		[
			[
				'ident-token',
				'-\\40webkit-width',
				0,
				15,
				{ value: '-@webkit-width' },
			],
			['EOF-token', '', -1, -1, undefined],
		],
	);
}

{
	const token = ['ident-token', 'prop', 0, 2, { value: 'prop' }];
	mutateIdent(token, '$');

	assert.deepEqual(
		token,
		['ident-token', '\\24 ', 0, 2, { value: '$' }],
	);

	const raw = stringify(token);
	assert.deepEqual(
		raw,
		'\\24 ',
	);

	const t = tokenizer({
		css: raw,
	});

	assert.deepEqual(
		collectTokens(t),
		[
			['ident-token', '\\24 ', 0, 3, { value: '$' }],
			['EOF-token', '', -1, -1, undefined],
		],
	);
}
