import assert from 'assert';
import { Reader } from '@csstools/css-tokenizer';

{
	const r = new Reader('abc👨‍👨‍👧‍👦d');

	{
		const peeked = r.codePointSource[r.cursor];
		assert.deepEqual(
			peeked,
			97,
		);

		assert.deepEqual(
			String.fromCharCode(peeked),
			'a',
		);

		assert.deepEqual(
			[
				r.representationStart,
				r.representationEnd,
			],
			[
				0,
				-1,
			],
		);
	}

	{
		const peeked = [
			r.codePointSource[r.cursor],
			r.codePointSource[r.cursor+1],
		];
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
			[
				r.representationStart,
				r.representationEnd,
			],
			[
				0,
				-1,
			],
		);
	}

	{
		const peeked = [
			r.codePointSource[r.cursor],
			r.codePointSource[r.cursor+1],
			r.codePointSource[r.cursor+2],
		];
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
			[
				r.representationStart,
				r.representationEnd,
			],
			[
				0,
				-1,
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
			[
				r.representationStart,
				r.representationEnd,
			],
			[
				0,
				0,
			],
		);

		assert.deepEqual(
			r.representationString(),
			'a',
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
			[
				r.representationStart,
				r.representationEnd,
			],
			[
				1,
				4,
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
			[
				r.representationStart,
				r.representationEnd,
			],
			[
				1,
				14,
			],
		);

		assert.deepEqual(
			r.slice(r.representationStart, r.representationEnd + 1),
			'bc👨‍👨‍👧‍👦d',
		);

		assert.deepEqual(
			r.representationString(),
			'bc👨‍👨‍👧‍👦d',
		);
	}
}
