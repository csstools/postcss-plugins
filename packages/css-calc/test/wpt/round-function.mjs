import { calc } from '@csstools/css-calc';
import assert from 'assert';

assert.strictEqual(
	calc('calc(45deg + 45deg)'),
	'90deg',
);

assert.strictEqual(
	calc('round(23px, 10px)'),
	'20px',
);

assert.strictEqual(
	calc('round(18px, 10px)'),
	'20px',
);

assert.strictEqual(
	calc('round(15px, 10px)'),
	'20px',
);

assert.strictEqual(
	calc('round(13px, 10px)'),
	'10px',
);

assert.strictEqual(
	calc('round(-13px, 10px)'),
	'-10px',
);

assert.strictEqual(
	calc('round(-18px, 10px)'),
	'-20px',
);

assert.strictEqual(
	calc('round(nearest, 23px, 10px)'),
	'20px',
);

assert.strictEqual(
	calc('round(nearest, 18px, 10px)'),
	'20px',
);

assert.strictEqual(
	calc('round(nearest, 15px, 10px)'),
	'20px',
);

assert.strictEqual(
	calc('round(nearest, 13px, 10px)'),
	'10px',
);

assert.strictEqual(
	calc('round(nearest, -13px, 10px)'),
	'-10px',
);

assert.strictEqual(
	calc('round(nearest, -18px, 10px)'),
	'-20px',
);

assert.strictEqual(
	calc('round(down, 23px, 10px)'),
	'20px',
);

assert.strictEqual(
	calc('round(down, 18px, 10px)'),
	'10px',
);

assert.strictEqual(
	calc('round(down, 15px, 10px)'),
	'10px',
);

assert.strictEqual(
	calc('round(down, 13px, 10px)'),
	'10px',
);

assert.strictEqual(
	calc('round(down, -13px, 10px)'),
	'-20px',
);

assert.strictEqual(
	calc('round(down, -18px, 10px)'),
	'-20px',
);

assert.strictEqual(
	calc('round(up, 23px, 10px)'),
	'30px',
);

assert.strictEqual(
	calc('round(up, 18px, 10px)'),
	'20px',
);

assert.strictEqual(
	calc('round(up, 15px, 10px)'),
	'20px',
);

assert.strictEqual(
	calc('round(up, 13px, 10px)'),
	'20px',
);

assert.strictEqual(
	calc('round(up, -13px, 10px)'),
	'-10px',
);

assert.strictEqual(
	calc('round(up, -18px, 10px)'),
	'-10px',
);

assert.strictEqual(
	calc('round(to-zero, 23px, 10px)'),
	'20px',
);

assert.strictEqual(
	calc('round(to-zero, 18px, 10px)'),
	'10px',
);

assert.strictEqual(
	calc('round(to-zero, 15px, 10px)'),
	'10px',
);

assert.strictEqual(
	calc('round(to-zero, 13px, 10px)'),
	'10px',
);

assert.strictEqual(
	calc('round(to-zero, -13px, 10px)'),
	'-10px',
);

assert.strictEqual(
	calc('round(to-zero, -18px, 10px)'),
	'-10px',
);

assert.strictEqual(
	calc('round(23px, -10px)'),
	'20px',
);

assert.strictEqual(
	calc('round(18px, -10px)'),
	'20px',
);

assert.strictEqual(
	calc('round(15px, 10px)'),
	'20px',
);

assert.strictEqual(
	calc('round(15px, -10px)'),
	'20px',
);

assert.strictEqual(
	calc('round(13px, -10px)'),
	'10px',
);

assert.strictEqual(
	calc('round(-13px, -10px)'),
	'-10px',
);

assert.strictEqual(
	calc('round(-18px, -10px)'),
	'-20px',
);

assert.strictEqual(
	calc('round(5, 0)'),
	'calc(NaN)',
);

assert.strictEqual(
	calc('round(infinity, infinity)'),
	'calc(NaN)',
);

assert.strictEqual(
	calc('round(infinity, -infinity)'),
	'calc(NaN)',
);

assert.strictEqual(
	calc('round(-infinity, infinity)'),
	'calc(NaN)',
);

assert.strictEqual(
	calc('round(-infinity, -infinity)'),
	'calc(NaN)',
);

// infinite value with finite step is the same infinity
assert.strictEqual(
	calc('round(infinity, 5)'),
	'calc(infinity)',
);

assert.strictEqual(
	calc('round(infinity, -5)'),
	'calc(infinity)',
);

assert.strictEqual(
	calc('round(-infinity, 5)'),
	'calc(-infinity)',
);

assert.strictEqual(
	calc('round(-infinity, -5)'),
	'calc(-infinity)',
);


// Finite value with infinite step depends on rounding strategy.
// 'nearest' and 'to-zero': pos and +0 go to +0, neg and -0 go to -0
assert.strictEqual(
	calc('round(5, infinity)'),
	'0',
);

assert.strictEqual(
	calc('round(5, -infinity)'),
	'0',
);

assert.strictEqual(
	calc('round(-5, infinity)'),
	'-0',
);

assert.strictEqual(
	calc('round(-5, -infinity)'),
	'-0',
);

assert.strictEqual(
	calc('round(to-zero, 5, infinity)'),
	'0',
);

assert.strictEqual(
	calc('round(to-zero, 5, -infinity)'),
	'0',
);

assert.strictEqual(
	calc('round(to-zero, -5, infinity)'),
	'-0',
);

assert.strictEqual(
	calc('round(to-zero, -5, -infinity)'),
	'-0',
);

// 'up': pos goes to +inf, 0+ goes to 0+, else 0-
assert.strictEqual(
	calc('round(up, 1, infinity)'),
	'calc(infinity)',
);

assert.strictEqual(
	calc('round(up, 0, infinity)'),
	'0',
);

assert.strictEqual(
	calc('round(up, -0, infinity)'),
	'-0',
);

assert.strictEqual(
	calc('round(up, -1, infinity)'),
	'-0',
);

// 'down': neg goes to -inf, -0 goes to -0, else 0+
assert.strictEqual(
	calc('round(down, -1, infinity)'),
	'calc(-infinity)',
);

assert.strictEqual(
	calc('round(down, -0, infinity)'),
	'-0',
);

assert.strictEqual(
	calc('round(down, -0px, calc(1px * infinity))'),
	'-0px',
);

assert.strictEqual(
	calc('round(down, -0%, calc(1% * infinity))'),
	'-0%',
);

assert.strictEqual(
	calc('round(down, 0, infinity)'),
	'0',
);

assert.strictEqual(
	calc('round(down, 1, infinity)'),
	'0',
);

assert.strictEqual(
	calc('round(2.3)'),
	'2',
);

assert.strictEqual(
	calc('round(3.7)'),
	'4',
);

assert.strictEqual(
	calc('round(3.7px)'),
	'round(3.7px)',
);
