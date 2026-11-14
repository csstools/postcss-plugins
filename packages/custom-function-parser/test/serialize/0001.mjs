import assert from 'node:assert';
import { parse } from '@csstools/custom-function-parser';


{
	const fn = parse('--foo(--a type(<length>): {1px, 2px}, --b)');

	assert.strictEqual(
		fn.parameters[0].toString(),
		'--a type(<length>): {1px, 2px},',
	);

	assert.strictEqual(
		fn.parameters[1].toString(),
		' --b',
	);

	assert.strictEqual(
		fn.parameters.map((parameter) => parameter.toString()).join(''),
		'--a type(<length>): {1px, 2px}, --b',
	);

	assert.strictEqual(
		fn.toString(),
		'--foo(--a type(<length>): {1px, 2px}, --b)',
	);
}

{
	const fn = parse('--foo(--a )');

	assert.strictEqual(
		fn.parameters[0].toString(),
		'--a ',
	);
}

{
	const fn = parse(' /* a */ --foo( /* b */ --a /* c */ ) /* d */ ');

	assert.strictEqual(
		fn.parameters[0].toString(),
		' /* b */ --a /* c */ ',
	);

	assert.strictEqual(
		fn.toString(),
		' /* a */ --foo( /* b */ --a /* c */ ) /* d */ ',
	);
}
