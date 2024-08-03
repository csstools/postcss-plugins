import assert from 'node:assert';
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
			String.fromCodePoint(peeked),
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
			String.fromCodePoint(peeked[0]),
			'a',
		);

		assert.deepEqual(
			String.fromCodePoint(peeked[1]),
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
			String.fromCodePoint(peeked[0]),
			'a',
		);

		assert.deepEqual(
			String.fromCodePoint(peeked[1]),
			'b',
		);

		assert.deepEqual(
			String.fromCodePoint(peeked[2]),
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
			String.fromCodePoint(read),
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
			r.source.slice(r.representationStart, r.representationEnd + 1),
			'a',
		);
	}

	r.representationStart = r.cursor;
	r.representationEnd = -1;

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
			128104,
		);

		assert.deepEqual(
			String.fromCodePoint(read3),
			'👨',
		);

		const read4 = r.readCodePoint();
		assert.deepEqual(
			read4,
			8205,
		);

		assert.deepEqual(
			String.fromCodePoint(read4),
			'‍',
		);

		assert.deepEqual(
			[
				r.representationStart,
				r.representationEnd,
			],
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
			r.source.slice(r.representationStart, r.representationEnd + 1),
			'bc👨‍👨‍👧‍👦d',
		);

		{
			// Reader should be exhausted.
			// Extra reads do not change the representation.

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
				r.source.slice(r.representationStart, r.representationEnd + 1),
				'bc👨‍👨‍👧‍👦d',
			);
		}
	}
}
