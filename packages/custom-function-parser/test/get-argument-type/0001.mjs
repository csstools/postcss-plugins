import assert from 'node:assert';
import { parse } from '@csstools/custom-function-parser';


{
	const fn = parse('--foo(--bar, --baz <string>: "foo")');

	assert.strictEqual(
		fn.parameters[0].getArgumentType(),
		'',
	);

	assert.strictEqual(
		fn.parameters[1].getArgumentType(),
		'<string>',
	);
}

{
	const fn = parse('--foo(--bar, --baz type(<string>): "foo")');

	assert.strictEqual(
		fn.parameters[0].getArgumentType(),
		'',
	);

	assert.strictEqual(
		fn.parameters[1].getArgumentType(),
		'<string>',
	);
}

{
	const fn = parse('--foo(--bar /* a comment */ <string> /* a comment */ : /* a comment */ "foo")');

	assert.strictEqual(
		fn.parameters[0].getArgumentType(),
		'<string>',
	);
}

{
	const fn = parse('--foo(--bar type(/* a comment */ <string> /* a comment */) : /* a comment */ "foo")');

	assert.strictEqual(
		fn.parameters[0].getArgumentType(),
		'<string>',
	);
}

{
	const fn = parse('--foo(--bar [ /* a comment */ <string> /* a comment */ | /* a comment */ <color> /* a comment */ ] : /* a comment */ "foo")');

	assert.strictEqual(
		fn.parameters[0].getArgumentType(),
		'[  <string>  |  <color>  ]',
	);
}

{
	const fn = parse('--foo(--bar type([ /* a comment */ <string> /* a comment */ | /* a comment */ <color> /* a comment */ ]) : /* a comment */ "foo")');

	assert.strictEqual(
		fn.parameters[0].getArgumentType(),
		'[  <string>  |  <color>  ]',
	);
}
