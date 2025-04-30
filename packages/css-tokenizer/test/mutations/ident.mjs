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
		['ident-token', 'foo\\.bar', 0, 6, { value: 'foo.bar' }],
	);

	const raw = stringify(token);
	assert.deepEqual(
		raw,
		'foo\\.bar',
	);

	const t = tokenizer({
		css: raw,
	});

	assert.deepEqual(
		collectTokens(t),
		[
			['ident-token', 'foo\\.bar', 0, 7, { value: 'foo.bar' }],
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
		['ident-token', '\\-', 0, 2, { value: '-' }],
	);

	const raw = stringify(token);
	assert.deepEqual(
		raw,
		'\\-',
	);

	const t = tokenizer({
		css: raw,
	});

	assert.deepEqual(
		collectTokens(t),
		[
			['ident-token', '\\-', 0, 1, { value: '-' }],
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
		['ident-token', '--\\%other-prop', 0, 2, { value: '--%other-prop' }],
	);

	const raw = stringify(token);
	assert.deepEqual(
		raw,
		'--\\%other-prop',
	);

	const t = tokenizer({
		css: raw,
	});

	assert.deepEqual(
		collectTokens(t),
		[
			[
				'ident-token',
				'--\\%other-prop',
				0,
				13,
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
		['ident-token', '--\\%a-prop', 0, 2, { value: '--%a-prop' }],
	);

	const raw = stringify(token);
	assert.deepEqual(
		raw,
		'--\\%a-prop',
	);

	const t = tokenizer({
		css: raw,
	});

	assert.deepEqual(
		collectTokens(t),
		[
			[
				'ident-token',
				'--\\%a-prop',
				0,
				9,
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
			'-\\40 webkit-width',
			0,
			2,
			{ value: '-@webkit-width' },
		],
	);

	const raw = stringify(token);
	assert.deepEqual(
		raw,
		'-\\40 webkit-width',
	);

	const t = tokenizer({
		css: raw,
	});

	assert.deepEqual(
		collectTokens(t),
		[
			[
				'ident-token',
				'-\\40 webkit-width',
				0,
				16,
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

{
	const token = ['ident-token', 'prop', 0, 2, { value: 'prop' }];
	mutateIdent(token, '-');

	assert.deepEqual(
		token,
		['ident-token', '\\-', 0, 2, { value: '-' }],
	);

	const raw = stringify(token);
	assert.deepEqual(
		raw,
		'\\-',
	);

	const t = tokenizer({
		css: raw,
	});

	assert.deepEqual(
		collectTokens(t),
		[
			['ident-token', '\\-', 0, 1, { value: '-' }],
			['EOF-token', '', -1, -1, undefined],
		],
	);
}

{
	const token = ['ident-token', 'prop', 0, 2, { value: 'prop' }];
	mutateIdent(token, String.fromCodePoint(0x000));

	assert.deepEqual(
		token,
		['ident-token', String.fromCodePoint(0xFFFD), 0, 2, { value: String.fromCodePoint(0x000) }],
	);

	const raw = stringify(token);
	assert.deepEqual(
		raw,
		String.fromCodePoint(0xFFFD),
	);

	const t = tokenizer({
		css: raw,
	});

	assert.deepEqual(
		collectTokens(t),
		[
			['ident-token', String.fromCodePoint(0xFFFD), 0, 0, { value: String.fromCodePoint(0xFFFD) }],
			['EOF-token', '', -1, -1, undefined],
		],
	);
}

{
	const token = ['ident-token', 'prop', 0, 2, { value: 'prop' }];
	mutateIdent(token, 'aa' + String.fromCodePoint(0x000));

	assert.deepEqual(
		token,
		['ident-token', 'aa' + String.fromCodePoint(0xFFFD), 0, 2, { value: 'aa' + String.fromCodePoint(0x000) }],
	);

	const raw = stringify(token);
	assert.deepEqual(
		raw,
		'aa' + String.fromCodePoint(0xFFFD),
	);

	const t = tokenizer({
		css: raw,
	});

	assert.deepEqual(
		collectTokens(t),
		[
			['ident-token', 'aa' + String.fromCodePoint(0xFFFD), 0, 2, { value: 'aa' + String.fromCodePoint(0xFFFD) }],
			['EOF-token', '', -1, -1, undefined],
		],
	);
}
