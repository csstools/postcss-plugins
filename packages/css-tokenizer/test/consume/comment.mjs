import assert from 'assert';
import { Reader, consumeComment } from '@csstools/css-tokenizer';

{
	const r = new Reader('/* a comment */');
	r.readCodePoint();

	const token = consumeComment(r);

	assert.deepEqual(
		token,
		['comment', ' a comment ', 0, 15],
	);

	assert.deepEqual(
		r.slice(token[2], token[3]),
		'/* a comment */',
	);
}
