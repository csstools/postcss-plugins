import { calc } from '@csstools/css-calc';
import assert from 'node:assert';

assert.strictEqual(
	calc('min(1s)'),
	'1s',
);

assert.strictEqual(
	calc('round()'),
	'round()',
);

assert.strictEqual(
	calc('round( )'),
	'round( )',
);

assert.strictEqual(
	calc('round(,)'),
	'round(,)',
);

assert.strictEqual(
	calc('round(1, )'),
	'round(1, )',
);

assert.strictEqual(
	calc('round(, 1)'),
	'round(, 1)',
);

assert.strictEqual(
	calc('round(1 + )'),
	'round(1 + )',
);

assert.strictEqual(
	calc('round(1 - )'),
	'round(1 - )',
);

assert.strictEqual(
	calc('round(1 * )'),
	'round(1 * )',
);

assert.strictEqual(
	calc('round(1 / )'),
	'round(1 / )',
);

assert.strictEqual(
	calc('round(1 2)'),
	'round(1 2)',
);

assert.strictEqual(
	calc('round(nearest, 1 2)'),
	'round(nearest, 1 2)',
);

assert.strictEqual(
	calc('round(1, nearest, 12)'),
	'round(1, nearest, 12)',
);

assert.strictEqual(
	calc('round(1, nearest)'),
	'round(1, nearest)',
);

assert.strictEqual(
	calc('round(nearest, 1, nearest)'),
	'round(nearest, 1, nearest)',
);

assert.strictEqual(
	calc('round(nearest, 1)'),
	'1',
);

assert.strictEqual(
	calc('round(1, , 2)'),
	'round(1, , 2)',
);

assert.strictEqual(
	calc('mod()'),
	'mod()',
);

assert.strictEqual(
	calc('mod( )'),
	'mod( )',
);

assert.strictEqual(
	calc('mod(,)'),
	'mod(,)',
);

assert.strictEqual(
	calc('mod(1, )'),
	'mod(1, )',
);

assert.strictEqual(
	calc('mod(, 1)'),
	'mod(, 1)',
);

assert.strictEqual(
	calc('mod(1 + )'),
	'mod(1 + )',
);

assert.strictEqual(
	calc('mod(1 - )'),
	'mod(1 - )',
);

assert.strictEqual(
	calc('mod(1 * )'),
	'mod(1 * )',
);

assert.strictEqual(
	calc('mod(1 / )'),
	'mod(1 / )',
);

assert.strictEqual(
	calc('mod(1 2)'),
	'mod(1 2)',
);

assert.strictEqual(
	calc('mod(1, , 2)'),
	'mod(1, , 2)',
);

assert.strictEqual(
	calc('rem()'),
	'rem()',
);

assert.strictEqual(
	calc('rem( )'),
	'rem( )',
);

assert.strictEqual(
	calc('rem(,)'),
	'rem(,)',
);

assert.strictEqual(
	calc('rem(1, )'),
	'rem(1, )',
);

assert.strictEqual(
	calc('rem(, 1)'),
	'rem(, 1)',
);

assert.strictEqual(
	calc('rem(1 + )'),
	'rem(1 + )',
);

assert.strictEqual(
	calc('rem(1 - )'),
	'rem(1 - )',
);

assert.strictEqual(
	calc('rem(1 * )'),
	'rem(1 * )',
);

assert.strictEqual(
	calc('rem(1 / )'),
	'rem(1 / )',
);

assert.strictEqual(
	calc('rem(1 2)'),
	'rem(1 2)',
);

assert.strictEqual(
	calc('rem(1, , 2)'),
	'rem(1, , 2)',
);

assert.strictEqual(
	calc('round(0px)'),
	'round(0px)',
);

assert.strictEqual(
	calc('round(0s)'),
	'round(0s)',
);

assert.strictEqual(
	calc('round(0deg)'),
	'round(0deg)',
);

assert.strictEqual(
	calc('round(0Hz)'),
	'round(0Hz)',
);

assert.strictEqual(
	calc('round(0dpi)'),
	'round(0dpi)',
);

assert.strictEqual(
	calc('round(0fr)'),
	'round(0fr)',
);

assert.strictEqual(
	calc('round(1, 1%)'),
	'round(1, 1%)',
);

assert.strictEqual(
	calc('round(1, 0px)'),
	'round(1, 0px)',
);

assert.strictEqual(
	calc('round(1, 0s)'),
	'round(1, 0s)',
);

assert.strictEqual(
	calc('round(1, 0deg)'),
	'round(1, 0deg)',
);

assert.strictEqual(
	calc('round(1, 0Hz)'),
	'round(1, 0Hz)',
);

assert.strictEqual(
	calc('round(1, 0dpi)'),
	'round(1, 0dpi)',
);

assert.strictEqual(
	calc('round(1, 0fr)'),
	'round(1, 0fr)',
);

assert.strictEqual(
	calc('mod(0px)'),
	'mod(0px)',
);

assert.strictEqual(
	calc('mod(0s)'),
	'mod(0s)',
);

assert.strictEqual(
	calc('mod(0deg)'),
	'mod(0deg)',
);

assert.strictEqual(
	calc('mod(0Hz)'),
	'mod(0Hz)',
);

assert.strictEqual(
	calc('mod(0dpi)'),
	'mod(0dpi)',
);

assert.strictEqual(
	calc('mod(0fr)'),
	'mod(0fr)',
);

assert.strictEqual(
	calc('mod(1, 1%)'),
	'mod(1, 1%)',
);

assert.strictEqual(
	calc('mod(1, 0px)'),
	'mod(1, 0px)',
);

assert.strictEqual(
	calc('mod(1, 0s)'),
	'mod(1, 0s)',
);

assert.strictEqual(
	calc('mod(1, 0deg)'),
	'mod(1, 0deg)',
);

assert.strictEqual(
	calc('mod(1, 0Hz)'),
	'mod(1, 0Hz)',
);

assert.strictEqual(
	calc('mod(1, 0dpi)'),
	'mod(1, 0dpi)',
);

assert.strictEqual(
	calc('mod(1, 0fr)'),
	'mod(1, 0fr)',
);

assert.strictEqual(
	calc('rem(0px)'),
	'rem(0px)',
);

assert.strictEqual(
	calc('rem(0s)'),
	'rem(0s)',
);

assert.strictEqual(
	calc('rem(0deg)'),
	'rem(0deg)',
);

assert.strictEqual(
	calc('rem(0Hz)'),
	'rem(0Hz)',
);

assert.strictEqual(
	calc('rem(0dpi)'),
	'rem(0dpi)',
);

assert.strictEqual(
	calc('rem(0fr)'),
	'rem(0fr)',
);

assert.strictEqual(
	calc('rem(1, 1%)'),
	'rem(1, 1%)',
);

assert.strictEqual(
	calc('rem(1, 0px)'),
	'rem(1, 0px)',
);

assert.strictEqual(
	calc('rem(1, 0s)'),
	'rem(1, 0s)',
);

assert.strictEqual(
	calc('rem(1, 0deg)'),
	'rem(1, 0deg)',
);

assert.strictEqual(
	calc('rem(1, 0Hz)'),
	'rem(1, 0Hz)',
);

assert.strictEqual(
	calc('rem(1, 0dpi)'),
	'rem(1, 0dpi)',
);

assert.strictEqual(
	calc('rem(1, 0fr)'),
	'rem(1, 0fr)',
);
