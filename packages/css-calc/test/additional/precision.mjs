import { calc } from '@csstools/css-calc';
import assert from 'node:assert';

// Values that serialize without scientific notation are rounded to `precision`
// decimal places.
assert.strictEqual(
	calc('calc(1 / 3)'),
	'0.3333333333333',
);

assert.strictEqual(
	calc('calc(1 / 3)', { precision: 5 }),
	'0.33333',
);

assert.strictEqual(
	calc('calc(0.1 + 0.2)'),
	'0.3',
);

// Values that serialize in scientific notation are left untouched.
// Reducing them to a number of decimals would destroy them (e.g. `1e-20` -> `0`).
assert.strictEqual(
	calc('calc(1e-10 * 1e-10)'),
	'1.0000000000000001e-20',
);

assert.strictEqual(
	calc('calc(1e-20 * 1)'),
	'1e-20',
);

assert.strictEqual(
	calc('calc(1e-300 * 1)'),
	'1e-300',
);

assert.strictEqual(
	calc('calc(1e300 * 1)'),
	'1e+300',
);

assert.strictEqual(
	calc('calc(1e21 * 1)'),
	'1e+21',
);

assert.strictEqual(
	calc('calc(1e-10 * 1e-10)', { precision: 5 }),
	'1.0000000000000001e-20',
);
