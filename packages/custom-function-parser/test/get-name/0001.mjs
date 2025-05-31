import assert from 'node:assert';
import { parse } from '@csstools/custom-function-parser';

{
	const fn = parse('--foo()');

	assert.strictEqual(
		fn.getName(),
		'--foo',
	);
}

{
	const fn = parse('--foo(--bar)');

	assert.strictEqual(
		fn.parameters[0].getName(),
		'--bar',
	);
}

{
	const fn = parse('--foo(--bar, --baz <string>: "foo")');

	assert.strictEqual(
		fn.parameters[0].getName(),
		'--bar',
	);

	assert.strictEqual(
		fn.parameters[1].getName(),
		'--baz',
	);
}
