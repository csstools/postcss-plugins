import { tokenizeGridTemplateAreas, tokenize, isTokenString } from '@csstools/css-tokenizer';
import assert from 'node:assert';

function tokenizeFromSource(source) {
	const t = tokenize({ css: source });
	const firstString = t.find(isTokenString);
	if (!firstString) {
		return [];
	}

	return tokenizeGridTemplateAreas(firstString[4].value);
}

{
	assert.deepEqual(
		tokenizeFromSource('"a a"'),
		[
			{ type: 'named-cell-token', value: 'a' },
			{ type: 'named-cell-token', value: 'a' },
		],
	);
}

{
	assert.deepEqual(
		tokenizeFromSource('"a"'),
		[{ type: 'named-cell-token', value: 'a' }],
	);
}

{
	assert.deepEqual(
		tokenizeFromSource('"."'),
		[{ type: 'null-cell-token', value: '.' }],
	);
}

{
	assert.deepEqual(
		tokenizeFromSource('"..."'),
		[{ type: 'null-cell-token', value: '...' }],
	);
}

{
	assert.deepEqual(
		tokenizeFromSource('"@ a"'),
		[
			{ type: 'trash-token', value: '@' },
			{ type: 'named-cell-token', value: 'a' },
		],
	);
}

{
	assert.deepEqual(
		// Unescaped, so bad string
		tokenizeFromSource('"a\nb"'),
		[],
	);
}

{
	assert.deepEqual(
		// Escaped, so regular string
		tokenizeFromSource('"a\\\nb"'),
		[{ type: 'named-cell-token', value: 'ab' }],
	);
}

{
	assert.deepEqual(
		// Escaped, so regular string
		tokenizeFromSource('"a\\\n b"'),
		[
			{ type: 'named-cell-token', value: 'a' },
			{ type: 'named-cell-token', value: 'b' },
		],
	);
}

{
	assert.deepEqual(
		tokenizeFromSource('"a\\\\"'),
		[
			{ type: 'named-cell-token', value: 'a' },
			{ type: 'trash-token', value: '\\' },
		],
	);
}

{
	assert.deepEqual(
		tokenizeFromSource('"tu\\0U"'),
		[{ type: 'named-cell-token', value: 'tu�U' }],
	);
}

{
	assert.deepEqual(
		tokenizeFromSource('"tu\\\\0U"'),
		[
			{ type: 'named-cell-token', value: 'tu' },
			{ type: 'trash-token', value: '\\' },
			{ type: 'named-cell-token', value: '0U' },
		],
	);
}
