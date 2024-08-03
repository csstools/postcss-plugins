import assert from 'node:assert';
import { parse } from '@csstools/media-query-list-parser';

{
	const resultAST = parse('[a, b], all', {
		preserveInvalidMediaQueries: true,
	});

	assert.equal(
		resultAST.length,
		2,
	);

	assert.equal(
		resultAST[0].type,
		'media-query-invalid',
	);
}

{
	const resultAST = parse('[a, b], all', {
		preserveInvalidMediaQueries: false,
	});

	assert.equal(
		resultAST.length,
		1,
	);
}

{
	const resultAST = parse('[a, b], all');

	assert.equal(
		resultAST.length,
		1,
	);
}

{
	const resultAST = parse('(foo');

	assert.equal(
		resultAST.length,
		1,
	);
}

{
	let error;
	const resultAST = parse('(foo', {
		onParseError: (err) => {
			error = err;
		},
	});

	assert.equal(
		resultAST.length,
		1,
	);

	assert.deepEqual(
		{
			message: error.message,
			sourceStart: error.sourceStart,
			sourceEnd: error.sourceEnd,
			parserState: error.parserState,
		},
		{
			message: 'Unexpected EOF while consuming a simple block.',
			sourceStart: 0,
			sourceEnd: -1,
			parserState: ['5.4.8. Consume a simple block', 'Unexpected EOF'],
		},
	);
}


{
	const resultAST = parse('(foo');

	assert.equal(
		resultAST.length,
		1,
	);
}

{
	let error;
	const resultAST = parse('(foo', {
		onParseError: (err) => {
			error = err;
		},
	});

	assert.equal(
		resultAST.length,
		1,
	);

	assert.deepEqual(
		{
			message: error.message,
			sourceStart: error.sourceStart,
			sourceEnd: error.sourceEnd,
			parserState: error.parserState,
		},
		{
			message: 'Unexpected EOF while consuming a simple block.',
			sourceStart: 0,
			sourceEnd: -1,
			parserState: ['5.4.8. Consume a simple block', 'Unexpected EOF'],
		},
	);
}
