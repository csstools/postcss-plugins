import assert from 'assert';
import { Reader, consumeNumericToken } from '@csstools/css-tokenizer';

{
	const r = new Reader('10px');

	const token = consumeNumericToken(r);

	assert.deepEqual(
		token,
		['dimension', '10px', 0, 3, { value: 10, type: 'integer', unit: 'px' }],
	);

	assert.deepEqual(
		r.slice(token[2], token[3] + 1),
		'10px',
	);

	assert.deepEqual(
		r.representationString(),
		'10px',
	);
}
