import assert from 'assert';
import { Reader, consumeNumber } from '@csstools/css-tokenizer';

{
	const r = new Reader('12');
	const number = consumeNumber({}, r);

	assert.deepEqual(
		number,
		[12, 'integer'],
	);
}

{
	const r = new Reader('4.01');
	const number = consumeNumber({}, r);

	assert.deepEqual(
		number,
		[4.01, 'number'],
	);
}

{
	const r = new Reader('-456.8');
	const number = consumeNumber({}, r);

	assert.deepEqual(
		number,
		[-456.8, 'number'],
	);
}

{
	const r = new Reader('0.0');
	const number = consumeNumber({}, r);

	assert.deepEqual(
		number,
		[0, 'number'],
	);
}

{
	const r = new Reader('+0.0');
	const number = consumeNumber({}, r);

	assert.deepEqual(
		number,
		[0, 'number'],
	);
}

{
	const r = new Reader('-0.0');
	const number = consumeNumber({}, r);

	assert.deepEqual(
		number,
		[0, 'number'],
	);
}

{
	const r = new Reader('.60');
	const number = consumeNumber({}, r);

	assert.deepEqual(
		number,
		[0.6, 'number'],
	);
}

{
	const r = new Reader('10e3');
	const number = consumeNumber({}, r);

	assert.deepEqual(
		number,
		[10e3, 'number'],
	);
}

{
	const r = new Reader('-3.4e-2');
	const number = consumeNumber({}, r);

	assert.deepEqual(
		number,
		[-0.034, 'number'],
	);
}

// consumeNumber doesn't validate that inputs would form number tokens.
// Any validation has to be done externally.
// A result of this is that invalid inputs do return numbers when fed to this algorithm
{
	const r = new Reader('12.');
	const number = consumeNumber({}, r);

	assert.deepEqual(
		number,
		[12, 'integer'],
	);
}

{
	const r = new Reader('+-12.2');
	const number = consumeNumber({}, r);

	assert.deepEqual(
		number,
		[0, 'integer'],
	);
}

{
	const r = new Reader('12.1.1');
	const number = consumeNumber({}, r);

	assert.deepEqual(
		number,
		[12.1, 'number'],
	);
}
