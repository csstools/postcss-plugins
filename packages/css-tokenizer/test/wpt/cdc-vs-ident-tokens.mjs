import { tokenizer } from '@csstools/css-tokenizer';
import assert from 'node:assert';
import { collectTokens } from '../util/collect-tokens.mjs';

{
	const t = tokenizer({
		css: '-->--foo { color: blue; }',
	});

	assert.deepEqual(
		collectTokens(t),
		[
			['CDC-token', '-->', 0, 2, undefined],
			['ident-token', '--foo', 3, 7, { value: '--foo' }],
			['whitespace-token', ' ', 8, 8, undefined],
			['{-token', '{', 9, 9, undefined],
			['whitespace-token', ' ', 10, 10, undefined],
			['ident-token', 'color', 11, 15, { value: 'color' }],
			['colon-token', ':', 16, 16, undefined],
			['whitespace-token', ' ', 17, 17, undefined],
			['ident-token', 'blue', 18, 21, { value: 'blue' }],
			['semicolon-token', ';', 22, 22, undefined],
			['whitespace-token', ' ', 23, 23, undefined],
			['}-token', '}', 24, 24, undefined],
			['EOF-token', '', -1, -1, undefined],
		],
	);
}
