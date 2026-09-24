import assert from 'node:assert';
import { performance } from 'node:perf_hooks';
import { parse } from '@csstools/media-query-list-parser';

{
	const depth = 500;
	const source = '('.repeat(depth) + 'width' + ')'.repeat(depth);

	const start = performance.now();
	const resultAST = parse(source);
	const duration = performance.now() - start;

	assert.equal(resultAST.length, 1);

	assert.equal(
		resultAST[0].toString(),
		source,
	);

	assert.ok(
		duration < 1000,
		`Parsing a deeply nested media query took ${duration}ms, expected well under 1000ms.`,
	);
}
