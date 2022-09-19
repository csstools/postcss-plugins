import assert from 'assert';
import { Reader, consumeNumericToken } from '@csstools/css-tokenizer';

{
	const r = new Reader('10px');

	const token = consumeNumericToken({}, r);

	assert.deepEqual(
		token,
		['dimension-token', '10px', 0, 3, { value: 10, type: 'integer', unit: 'px' }],
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

{
	const r = new Reader('10%');

	const token = consumeNumericToken({}, r);

	assert.deepEqual(
		token,
		['percentage-token', '10%', 0, 2, { value: 10 }],
	);

	assert.deepEqual(
		r.slice(token[2], token[3] + 1),
		'10%',
	);

	assert.deepEqual(
		r.representationString(),
		'10%',
	);
}

{
	const r = new Reader('-3.4e-2');

	const token = consumeNumericToken({}, r);

	assert.deepEqual(
		token,
		['number-token', '-3.4e-2', 0, 6, { value: -0.034, type: 'number' }],
	);

	assert.deepEqual(
		r.slice(token[2], token[3] + 1),
		'-3.4e-2',
	);

	assert.deepEqual(
		r.representationString(),
		'-3.4e-2',
	);
}

{
	const r = new Reader('-3.4e');

	const token = consumeNumericToken({}, r);

	assert.deepEqual(
		token,
		['dimension-token', '-3.4e', 0, 4, { value: -3.4, type: 'number', unit: 'e' }],
	);

	assert.deepEqual(
		r.slice(token[2], token[3] + 1),
		'-3.4e',
	);

	assert.deepEqual(
		r.representationString(),
		'-3.4e',
	);
}

{
	const r = new Reader('20--foo');

	const token = consumeNumericToken({}, r);

	assert.deepEqual(
		token,
		['dimension-token', '20--foo', 0, 6, { value: 20, type: 'integer', unit: '--foo' }],
	);

	assert.deepEqual(
		r.slice(token[2], token[3] + 1),
		'20--foo',
	);

	assert.deepEqual(
		r.representationString(),
		'20--foo',
	);
}
