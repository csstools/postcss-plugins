import assert from 'node:assert';
import { parse } from '@csstools/media-query-list-parser';

{
	const result_a = parse(
		'screen',
		{ preserveInvalidMediaQueries: true },
	).map((x) => x.negateQuery().map((y) => y.toString().trim()));

	assert.deepEqual(
		result_a,
		[['not screen']],
	);

	const result_b = parse(
		'not screen',
		{ preserveInvalidMediaQueries: true },
	).map((x) => x.negateQuery().map((y) => y.toString().trim()));

	assert.deepEqual(
		result_b,
		[['screen']],
	);
}

{
	const result_a = parse(
		'all',
		{ preserveInvalidMediaQueries: true },
	).map((x) => x.negateQuery().map((y) => y.toString().trim()));

	assert.deepEqual(
		result_a,
		[['not all']],
	);

	const result_b = parse(
		'not all',
		{ preserveInvalidMediaQueries: true },
	).map((x) => x.negateQuery().map((y) => y.toString().trim()));

	assert.deepEqual(
		result_b,
		[['all']],
	);
}

{
	const result_a = parse(
		'(color)',
		{ preserveInvalidMediaQueries: true },
	).map((x) => x.negateQuery().map((y) => y.toString().trim()));

	assert.deepEqual(
		result_a,
		[['not all and (color)']],
	);

	const result_b = parse(
		'not (color)',
		{ preserveInvalidMediaQueries: true },
	).map((x) => x.negateQuery().map((y) => y.toString().trim()));

	assert.deepEqual(
		result_b,
		[['(color)']],
	);
}

{
	const result_a = parse(
		'(color) and (width)',
		{ preserveInvalidMediaQueries: true },
	).map((x) => x.negateQuery().map((y) => y.toString().trim()));

	assert.deepEqual(
		result_a,
		[['not all and ((color) and (width))']],
	);

	const result_b = parse(
		'not (color) and (width)',
		{ preserveInvalidMediaQueries: true },
	).map((x) => x.negateQuery().map((y) => y.toString().trim()));

	assert.deepEqual(
		result_b,
		[['not (color) and (width)']],
	);
}

{
	const result_a = parse(
		'((color) and (width))',
		{ preserveInvalidMediaQueries: true },
	).map((x) => x.negateQuery().map((y) => y.toString().trim()));

	assert.deepEqual(
		result_a,
		[['not all and ((color) and (width))']],
	);

	const result_b = parse(
		'not ((color) and (width))',
		{ preserveInvalidMediaQueries: true },
	).map((x) => x.negateQuery().map((y) => y.toString().trim()));

	assert.deepEqual(
		result_b,
		[['((color) and (width))']],
	);
}

{
	const result_a = parse(
		'(color) or (width)',
		{ preserveInvalidMediaQueries: true },
	).map((x) => x.negateQuery().map((y) => y.toString().trim()));

	assert.deepEqual(
		result_a,
		[['not all and ((color) or (width))']],
	);

	const result_b = parse(
		'not (color) or (width)',
		{ preserveInvalidMediaQueries: true },
	).map((x) => x.negateQuery().map((y) => y.toString().trim()));

	assert.deepEqual(
		result_b,
		[['not (color) or (width)']],
	);
}

{
	const result_a = parse(
		'((color) or (width))',
		{ preserveInvalidMediaQueries: true },
	).map((x) => x.negateQuery().map((y) => y.toString().trim()));

	assert.deepEqual(
		result_a,
		[['not all and ((color) or (width))']],
	);

	const result_b = parse(
		'not ((color) or (width))',
		{ preserveInvalidMediaQueries: true },
	).map((x) => x.negateQuery().map((y) => y.toString().trim()));

	assert.deepEqual(
		result_b,
		[['((color) or (width))']],
	);
}

{
	const result_a = parse(
		'screen and (color)',
		{ preserveInvalidMediaQueries: true },
	).map((x) => x.negateQuery().map((y) => y.toString().trim()));

	assert.deepEqual(
		result_a,
		[[
			'not screen',
			'not all and (color)',
		]],
	);

	const result_b = parse(
		'not screen and (color)',
		{ preserveInvalidMediaQueries: true },
	).map((x) => x.negateQuery().map((y) => y.toString().trim()));

	assert.deepEqual(
		result_b,
		[[
			'screen',
			'(color)',
		]],
	);
}

{
	const result_a = parse(
		'screen, (color)',
		{ preserveInvalidMediaQueries: true },
	).map((x) => x.negateQuery().map((y) => y.toString().trim()));

	assert.deepEqual(
		result_a,
		[['not screen'], ['not all and (color)']],
	);

	const result_b = parse(
		'not screen, not (color)',
		{ preserveInvalidMediaQueries: true },
	).map((x) => x.negateQuery().map((y) => y.toString().trim()));

	assert.deepEqual(
		result_b,
		[['screen'], ['(color)']],
	);
}

{
	const result_a = parse(
		'only screen',
		{ preserveInvalidMediaQueries: true },
	).map((x) => x.negateQuery().map((y) => y.toString().trim()));

	assert.deepEqual(
		result_a,
		[['not screen']],
	);

	const result_b = parse(
		'not screen',
		{ preserveInvalidMediaQueries: true },
	).map((x) => x.negateQuery().map((y) => y.toString().trim()));

	assert.deepEqual(
		result_b,
		[['screen']],
	);
}
