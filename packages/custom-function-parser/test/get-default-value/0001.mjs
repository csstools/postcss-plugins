import assert from 'node:assert';
import { parse } from '@csstools/custom-function-parser';
import { tokenize } from '@csstools/css-tokenizer';


{
	const fn = parse('--foo(--bar, --baz <string>: "foo")');

	assert.strictEqual(
		fn.parameters[0].getDefaultValue(),
		null,
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
		fn,
		false,
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

{
	const fn = parse('--foo(--bar:, --baz)');

	assert.strictEqual(
		fn.parameters[0].getDefaultValue(),
		'',
	);

	assert.strictEqual(
		fn.parameters[0].colon === null,
		false,
	);

	assert.strictEqual(
		fn.parameters[1].getDefaultValue(),
		null,
	);
}

{
	const fn = parse('--foo(--bar: 1px)');
	const parameter = fn.parameters[0];
	const colon = parameter.colon;

	assert.strictEqual(
		parameter.getDefaultValue(),
		'1px',
	);

	parameter.defaultValue = tokenize({ css: '2px' });

	assert.strictEqual(
		parameter.getDefaultValue(),
		'2px',
	);

	parameter.colon = null;

	assert.strictEqual(
		parameter.getDefaultValue(),
		null,
	);

	parameter.colon = colon;

	assert.strictEqual(
		parameter.getDefaultValue(),
		'2px',
	);
}
