import { convert } from '@csstools/css-calc';
import assert from 'assert';

assert.strictEqual(
	convert('min(1s)'),
	'1s',
);

assert.strictEqual(
	convert('round()'),
	'round()',
);

assert.strictEqual(
	convert('round( )'),
	'round( )',
);

assert.strictEqual(
	convert('round(,)'),
	'round(,)',
);

assert.strictEqual(
	convert('round(1, )'),
	'round(1, )',
);

assert.strictEqual(
	convert('round(, 1)'),
	'round(, 1)',
);

assert.strictEqual(
	convert('round(1 + )'),
	'round(1 + )',
);

assert.strictEqual(
	convert('round(1 - )'),
	'round(1 - )',
);

assert.strictEqual(
	convert('round(1 * )'),
	'round(1 * )',
);

assert.strictEqual(
	convert('round(1 / )'),
	'round(1 / )',
);

assert.strictEqual(
	convert('round(1 2)'),
	'round(1 2)',
);

assert.strictEqual(
	convert('round(nearest, 1 2)'),
	'round(nearest, 1 2)',
);

assert.strictEqual(
	convert('round(1, nearest, 12)'),
	'round(1, nearest, 12)',
);

assert.strictEqual(
	convert('round(1, nearest)'),
	'round(1, nearest)',
);

assert.strictEqual(
	convert('round(nearest, 1, nearest)'),
	'round(nearest, 1, nearest)',
);

assert.strictEqual(
	convert('round(nearest, 1)'),
	'round(nearest, 1)',
);

assert.strictEqual(
	convert('round(1, , 2)'),
	'round(1, , 2)',
);

assert.strictEqual(
	convert('mod()'),
	'mod()',
);

assert.strictEqual(
	convert('mod( )'),
	'mod( )',
);

assert.strictEqual(
	convert('mod(,)'),
	'mod(,)',
);

assert.strictEqual(
	convert('mod(1, )'),
	'mod(1, )',
);

assert.strictEqual(
	convert('mod(, 1)'),
	'mod(, 1)',
);

assert.strictEqual(
	convert('mod(1 + )'),
	'mod(1 + )',
);

assert.strictEqual(
	convert('mod(1 - )'),
	'mod(1 - )',
);

assert.strictEqual(
	convert('mod(1 * )'),
	'mod(1 * )',
);

assert.strictEqual(
	convert('mod(1 / )'),
	'mod(1 / )',
);

assert.strictEqual(
	convert('mod(1 2)'),
	'mod(1 2)',
);

assert.strictEqual(
	convert('mod(1, , 2)'),
	'mod(1, , 2)',
);

assert.strictEqual(
	convert('rem()'),
	'rem()',
);

assert.strictEqual(
	convert('rem( )'),
	'rem( )',
);

assert.strictEqual(
	convert('rem(,)'),
	'rem(,)',
);

assert.strictEqual(
	convert('rem(1, )'),
	'rem(1, )',
);

assert.strictEqual(
	convert('rem(, 1)'),
	'rem(, 1)',
);

assert.strictEqual(
	convert('rem(1 + )'),
	'rem(1 + )',
);

assert.strictEqual(
	convert('rem(1 - )'),
	'rem(1 - )',
);

assert.strictEqual(
	convert('rem(1 * )'),
	'rem(1 * )',
);

assert.strictEqual(
	convert('rem(1 / )'),
	'rem(1 / )',
);

assert.strictEqual(
	convert('rem(1 2)'),
	'rem(1 2)',
);

assert.strictEqual(
	convert('rem(1, , 2)'),
	'rem(1, , 2)',
);

assert.strictEqual(
	convert('round(0px)'),
	'round(0px)',
);

assert.strictEqual(
	convert('round(0s)'),
	'round(0s)',
);

assert.strictEqual(
	convert('round(0deg)'),
	'round(0deg)',
);

assert.strictEqual(
	convert('round(0Hz)'),
	'round(0Hz)',
);

assert.strictEqual(
	convert('round(0dpi)'),
	'round(0dpi)',
);

assert.strictEqual(
	convert('round(0fr)'),
	'round(0fr)',
);

assert.strictEqual(
	convert('round(1, 1%)'),
	'round(1, 1%)',
);

assert.strictEqual(
	convert('round(1, 0px)'),
	'round(1, 0px)',
);

assert.strictEqual(
	convert('round(1, 0s)'),
	'round(1, 0s)',
);

assert.strictEqual(
	convert('round(1, 0deg)'),
	'round(1, 0deg)',
);

assert.strictEqual(
	convert('round(1, 0Hz)'),
	'round(1, 0Hz)',
);

assert.strictEqual(
	convert('round(1, 0dpi)'),
	'round(1, 0dpi)',
);

assert.strictEqual(
	convert('round(1, 0fr)'),
	'round(1, 0fr)',
);

assert.strictEqual(
	convert('mod(0px)'),
	'mod(0px)',
);

assert.strictEqual(
	convert('mod(0s)'),
	'mod(0s)',
);

assert.strictEqual(
	convert('mod(0deg)'),
	'mod(0deg)',
);

assert.strictEqual(
	convert('mod(0Hz)'),
	'mod(0Hz)',
);

assert.strictEqual(
	convert('mod(0dpi)'),
	'mod(0dpi)',
);

assert.strictEqual(
	convert('mod(0fr)'),
	'mod(0fr)',
);

assert.strictEqual(
	convert('mod(1, 1%)'),
	'mod(1, 1%)',
);

assert.strictEqual(
	convert('mod(1, 0px)'),
	'mod(1, 0px)',
);

assert.strictEqual(
	convert('mod(1, 0s)'),
	'mod(1, 0s)',
);

assert.strictEqual(
	convert('mod(1, 0deg)'),
	'mod(1, 0deg)',
);

assert.strictEqual(
	convert('mod(1, 0Hz)'),
	'mod(1, 0Hz)',
);

assert.strictEqual(
	convert('mod(1, 0dpi)'),
	'mod(1, 0dpi)',
);

assert.strictEqual(
	convert('mod(1, 0fr)'),
	'mod(1, 0fr)',
);

assert.strictEqual(
	convert('rem(0px)'),
	'rem(0px)',
);

assert.strictEqual(
	convert('rem(0s)'),
	'rem(0s)',
);

assert.strictEqual(
	convert('rem(0deg)'),
	'rem(0deg)',
);

assert.strictEqual(
	convert('rem(0Hz)'),
	'rem(0Hz)',
);

assert.strictEqual(
	convert('rem(0dpi)'),
	'rem(0dpi)',
);

assert.strictEqual(
	convert('rem(0fr)'),
	'rem(0fr)',
);

assert.strictEqual(
	convert('rem(1, 1%)'),
	'rem(1, 1%)',
);

assert.strictEqual(
	convert('rem(1, 0px)'),
	'rem(1, 0px)',
);

assert.strictEqual(
	convert('rem(1, 0s)'),
	'rem(1, 0s)',
);

assert.strictEqual(
	convert('rem(1, 0deg)'),
	'rem(1, 0deg)',
);

assert.strictEqual(
	convert('rem(1, 0Hz)'),
	'rem(1, 0Hz)',
);

assert.strictEqual(
	convert('rem(1, 0dpi)'),
	'rem(1, 0dpi)',
);

assert.strictEqual(
	convert('rem(1, 0fr)'),
	'rem(1, 0fr)',
);
