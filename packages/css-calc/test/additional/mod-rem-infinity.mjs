import { calc } from '@csstools/css-calc';
import assert from 'assert';

assert.strictEqual(
	calc('mod(infinity, infinity)'),
	'calc(NaN)',
);

assert.strictEqual(
	calc('mod(-infinity, infinity)'),
	'calc(NaN)',
);

assert.strictEqual(
	calc('mod(-infinity, -infinity)'),
	'calc(NaN)',
);

assert.strictEqual(
	calc('mod(infinity, -infinity)'),
	'calc(NaN)',
);

assert.strictEqual(
	calc('mod(0, infinity)'),
	'0',
);

assert.strictEqual(
	calc('mod(calc(-1 * 0), infinity)'),
	'calc(NaN)',
);

assert.strictEqual(
	calc('mod(0, -infinity)'),
	'calc(NaN)',
);

assert.strictEqual(
	calc('mod(calc(-1 * 0), -infinity)'),
	'calc(-1 * 0)',
);

assert.strictEqual(
	calc('mod(infinity, 0)'),
	'calc(NaN)',
);

assert.strictEqual(
	calc('mod(-infinity, 0)'),
	'calc(NaN)',
);

assert.strictEqual(
	calc('mod(-infinity, -0)'),
	'calc(NaN)',
);

assert.strictEqual(
	calc('mod(infinity, -0)'),
	'calc(NaN)',
);

assert.strictEqual(
	calc('rem(infinity, infinity)'),
	'calc(NaN)',
);

assert.strictEqual(
	calc('rem(-infinity, infinity)'),
	'calc(NaN)',
);

assert.strictEqual(
	calc('rem(-infinity, -infinity)'),
	'calc(NaN)',
);

assert.strictEqual(
	calc('rem(infinity, -infinity)'),
	'calc(NaN)',
);

assert.strictEqual(
	calc('rem(0, infinity)'),
	'0',
);

assert.strictEqual(
	calc('rem(calc(-1 * 0), infinity)'),
	'calc(-1 * 0)',
);

assert.strictEqual(
	calc('rem(0, -infinity)'),
	'0',
);

assert.strictEqual(
	calc('rem(calc(-1 * 0), -infinity)'),
	'calc(-1 * 0)',
);

assert.strictEqual(
	calc('rem(infinity, 0)'),
	'calc(NaN)',
);

assert.strictEqual(
	calc('rem(-infinity, 0)'),
	'calc(NaN)',
);

assert.strictEqual(
	calc('rem(-infinity, calc(-1 * 0))'),
	'calc(NaN)',
);

assert.strictEqual(
	calc('rem(infinity, calc(-1 * 0))'),
	'calc(NaN)',
);
