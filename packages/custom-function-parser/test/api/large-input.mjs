import assert from 'node:assert';
import { parse } from '@csstools/custom-function-parser';

const payload = 'x '.repeat(100000);

{
	const fn = parse(`--foo(--a ${payload}: ${payload}) returns ${payload}`);

	assert.ok(fn);

	assert.strictEqual(
		fn.parameters[0].getParameterType(),
		payload.trim(),
	);

	assert.strictEqual(
		fn.parameters[0].getDefaultValue(),
		payload.trim(),
	);

	assert.strictEqual(
		fn.getReturnType(),
		payload.trim(),
	);

	assert.strictEqual(
		fn.parameters[0].toString(),
		`--a ${payload}: ${payload}`,
	);

	assert.strictEqual(
		fn.toString(),
		`--foo(--a ${payload}: ${payload}) returns ${payload}`,
	);
}
