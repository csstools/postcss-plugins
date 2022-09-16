import assert from 'assert';
import { tokenizer } from '@csstools/css-tokenizer';
import './test-reader.mjs';
import './consume/comment.mjs';

function collectTokens(t) {
	const bag = [];
	while (!t.endOfFile()) {
		bag.push(t.nextToken());
	}

	return bag;
}

{
	const t = tokenizer({
		css: '@media screen and (min-width: 200px) {}',
	});

	assert.deepEqual(
		collectTokens(t),
		[
			['at-word', '@media', 0, 5],
			['space', ' '],
			['word', 'screen', 7, 12],
			['space', ' '],
			['word', 'and', 14, 16],
			['space', ' '],
			['brackets', '(min-width: 200px)', 18, 35],
			['space', ' '],
			['{', '{', 37],
			['}', '}', 38],
		],
	);
}

{
	const t = tokenizer({
		css: `.foo { content: "hello

world!" }`,
	});

	assert.deepEqual(
		collectTokens(t),
		[
			['word', '.foo', 0, 3],
			['space', ' '],
			['{', '{', 5],
			['space', ' '],
			['word', 'content', 7, 13],
			[':', ':', 14],
			['space', ' '],
			['string', '"hello\n\nworld!"', 16, 30],
			['space', ' '],
			['}', '}', 32],
		],
	);
}
