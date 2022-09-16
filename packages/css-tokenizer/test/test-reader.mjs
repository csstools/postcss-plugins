import assert from 'assert';
import { Reader } from '@csstools/css-tokenizer';

{
	const r = new Reader('abc👨‍👨‍👧‍👦d');

	{
		const peeked = r.peekOneCodePoint();
		assert.deepEqual(
			peeked,
			97,
		);

		assert.deepEqual(
			String.fromCharCode(peeked),
			'a',
		);

		assert.deepEqual(
			r.representation(),
			[
				0,
				0,
			],
		);
	}

	{
		const peeked = r.peekTwoCodePoints();
		assert.deepEqual(
			peeked,
			[97, 98],
		);

		assert.deepEqual(
			String.fromCharCode(peeked[0]),
			'a',
		);

		assert.deepEqual(
			String.fromCharCode(peeked[1]),
			'b',
		);

		assert.deepEqual(
			r.representation(),
			[
				0,
				0,
			],
		);
	}

	{
		const peeked = r.peekThreeCodePoints();
		assert.deepEqual(
			peeked,
			[97, 98, 99],
		);

		assert.deepEqual(
			String.fromCharCode(peeked[0]),
			'a',
		);

		assert.deepEqual(
			String.fromCharCode(peeked[1]),
			'b',
		);

		assert.deepEqual(
			String.fromCharCode(peeked[2]),
			'c',
		);

		assert.deepEqual(
			r.representation(),
			[
				0,
				0,
			],
		);
	}

	{
		const read = r.readCodePoint();
		assert.deepEqual(
			read,
			97,
		);

		assert.deepEqual(
			String.fromCharCode(read),
			'a',
		);

		assert.deepEqual(
			r.representation(),
			[
				0,
				1,
			],
		);
	}

	r.resetRepresentation();

	{
		const read1 = r.readCodePoint();
		assert.deepEqual(
			read1,
			98,
		);

		const read2 = r.readCodePoint();
		assert.deepEqual(
			read2,
			99,
		);

		const read3 = r.readCodePoint();
		assert.deepEqual(
			read3,
			55357,
		);

		assert.deepEqual(
			String.fromCharCode(read3),
			'\uD83D',
		);

		const read4 = r.readCodePoint();
		assert.deepEqual(
			read4,
			56424,
		);

		assert.deepEqual(
			String.fromCharCode(read4),
			'\uDC68',
		);

		assert.deepEqual(
			r.representation(),
			[
				1,
				5,
			],
		);

		// Read to the end
		r.readCodePoint();
		r.readCodePoint();
		r.readCodePoint();
		r.readCodePoint();
		r.readCodePoint();
		r.readCodePoint();
		r.readCodePoint();
		r.readCodePoint();
		r.readCodePoint();
		r.readCodePoint();

		assert.deepEqual(
			r.representation(),
			[
				1,
				15,
			],
		);

		assert.deepEqual(
			r.slice(r.representation()[0], r.representation()[1]),
			'bc👨‍👨‍👧‍👦d',
		);
	}
}
