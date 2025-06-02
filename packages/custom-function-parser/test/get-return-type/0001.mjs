import assert from 'node:assert';
import { parse } from '@csstools/custom-function-parser';


{
	const fn = parse('--foo()');

	assert.strictEqual(
		fn.getReturnType(),
		'',
	);
}

{
	const fn = parse('--foo() returns <string>');

	assert.strictEqual(
		fn.getReturnType(),
		'<string>',
	);
}

{
	const fn = parse('--foo() returns type(<string>)');

	assert.strictEqual(
		fn.getReturnType(),
		'<string>',
	);
}

{
	const fn = parse('--foo(--bar: /* a comment */ "foo") returns /* a comment */ <string> /* a comment */');

	assert.strictEqual(
		fn.getReturnType(),
		'<string>',
	);
}

{
	const fn = parse('--foo(--bar: /* a comment */ "foo") returns type(/* a comment */ <string> /* a comment */)');

	assert.strictEqual(
		fn.getReturnType(),
		'<string>',
	);
}

{
	const fn = parse('--foo(--bar: /* a comment */ "foo") returns [ /* a comment */ <string> /* a comment */ | /* a comment */ <color> /* a comment */ ]');

	assert.strictEqual(
		fn.getReturnType(),
		'[  <string>  |  <color>  ]',
	);
}

{
	const fn = parse('--foo(--bar: /* a comment */ "foo") returns type([ /* a comment */ <string> /* a comment */ | /* a comment */ <color> /* a comment */ ])');

	assert.strictEqual(
		fn.getReturnType(),
		'[  <string>  |  <color>  ]',
	);
}
