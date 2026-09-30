import assert from 'node:assert';
import { parse } from '@csstools/custom-function-parser';


{
	const fn = parse('--foo(--bar, --baz <string>: "foo")');

	assert.strictEqual(
		fn.parameters[0].getDefaultValue(),
		'',
	);

	assert.strictEqual(
		fn.parameters[1].getDefaultValue(),
		'"foo"',
	);
}

{
	const fn = parse('--foo(--bar <string> : /* a comment */ "foo" /* a comment */)');

	assert.strictEqual(
		fn.parameters[0].getDefaultValue(),
		'/* a comment */ "foo" /* a comment */',
	);
}

{
	const fn = parse('--foo(--bar : /* a comment */ "foo" /* a comment */)');

	assert.strictEqual(
		fn.parameters[0].getDefaultValue(),
		'/* a comment */ "foo" /* a comment */',
	);
}

{
	const fn = parse('--foo(--bar: { 1, 2 }, --baz: 1)');

	assert.strictEqual(
		fn.parameters[0].getDefaultValue(),
		'1, 2',
	);

	assert.strictEqual(
		fn.parameters[1].getDefaultValue(),
		'1',
	);
}

{
	const fn = parse('--foo(--bar: { 1, 2 } "something", --baz: 1)');

	assert.strictEqual(
		fn.parameters[0].getDefaultValue(),
		'{ 1, 2 } "something"',
	);

	assert.strictEqual(
		fn.parameters[1].getDefaultValue(),
		'1',
	);
}


{
	const fn = parse('--foo(--bar: ( 1, 2 ), --baz: 1)');

	assert.strictEqual(
		fn.parameters[0].getDefaultValue(),
		'( 1, 2 )',
	);

	assert.strictEqual(
		fn.parameters[1].getDefaultValue(),
		'1',
	);
}
