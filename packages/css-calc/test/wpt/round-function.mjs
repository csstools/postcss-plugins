import { convert } from '@csstools/css-calc';
import assert from 'assert';

assert.strictEqual(
	convert('calc(45deg + 45deg)'),
	'90deg',
);

assert.strictEqual(
	convert('round(23px, 10px)'),
	'20px',
);

assert.strictEqual(
	convert('round(18px, 10px)'),
	'20px',
);

assert.strictEqual(
	convert('round(15px, 10px)'),
	'20px',
);

assert.strictEqual(
	convert('round(13px, 10px)'),
	'10px',
);

assert.strictEqual(
	convert('round(-13px, 10px)'),
	'-10px',
);

assert.strictEqual(
	convert('round(-18px, 10px)'),
	'-20px',
);

assert.strictEqual(
	convert('round(nearest, 23px, 10px)'),
	'20px',
);

assert.strictEqual(
	convert('round(nearest, 18px, 10px)'),
	'20px',
);

assert.strictEqual(
	convert('round(nearest, 15px, 10px)'),
	'20px',
);

assert.strictEqual(
	convert('round(nearest, 13px, 10px)'),
	'10px',
);

assert.strictEqual(
	convert('round(nearest, -13px, 10px)'),
	'-10px',
);

assert.strictEqual(
	convert('round(nearest, -18px, 10px)'),
	'-20px',
);

assert.strictEqual(
	convert('round(down, 23px, 10px)'),
	'20px',
);

assert.strictEqual(
	convert('round(down, 18px, 10px)'),
	'10px',
);

assert.strictEqual(
	convert('round(down, 15px, 10px)'),
	'10px',
);

assert.strictEqual(
	convert('round(down, 13px, 10px)'),
	'10px',
);

assert.strictEqual(
	convert('round(down, -13px, 10px)'),
	'-20px',
);

assert.strictEqual(
	convert('round(down, -18px, 10px)'),
	'-20px',
);

assert.strictEqual(
	convert('round(up, 23px, 10px)'),
	'30px',
);

assert.strictEqual(
	convert('round(up, 18px, 10px)'),
	'20px',
);

assert.strictEqual(
	convert('round(up, 15px, 10px)'),
	'20px',
);

assert.strictEqual(
	convert('round(up, 13px, 10px)'),
	'20px',
);

assert.strictEqual(
	convert('round(up, -13px, 10px)'),
	'-10px',
);

assert.strictEqual(
	convert('round(up, -18px, 10px)'),
	'-10px',
);

assert.strictEqual(
	convert('round(to-zero, 23px, 10px)'),
	'20px',
);

assert.strictEqual(
	convert('round(to-zero, 18px, 10px)'),
	'10px',
);

assert.strictEqual(
	convert('round(to-zero, 15px, 10px)'),
	'10px',
);

assert.strictEqual(
	convert('round(to-zero, 13px, 10px)'),
	'10px',
);

assert.strictEqual(
	convert('round(to-zero, -13px, 10px)'),
	'-10px',
);

assert.strictEqual(
	convert('round(to-zero, -18px, 10px)'),
	'-10px',
);

assert.strictEqual(
	convert('round(23px, -10px)'),
	'20px',
);

assert.strictEqual(
	convert('round(18px, -10px)'),
	'20px',
);

assert.strictEqual(
	convert('round(15px, 10px)'),
	'20px',
);

assert.strictEqual(
	convert('round(15px, -10px)'),
	'20px',
);

assert.strictEqual(
	convert('round(13px, -10px)'),
	'10px',
);

assert.strictEqual(
	convert('round(-13px, -10px)'),
	'-10px',
);

assert.strictEqual(
	convert('round(-18px, -10px)'),
	'-20px',
);

assert.strictEqual(
	convert('round(5, 0)'),
	'calc(NaN)',
);

assert.strictEqual(
	convert('round(infinity, infinity)'),
	'round(infinity, infinity)',
);

assert.strictEqual(
	convert('round(infinity, -infinity)'),
	'round(infinity, -infinity)',
);

assert.strictEqual(
	convert('round(-infinity, infinity)'),
	'round(-infinity, infinity)',
);

assert.strictEqual(
	convert('round(-infinity, -infinity)'),
	'round(-infinity, -infinity)',
);

assert.strictEqual(
	convert('round(to-zero, 5, infinity)'),
	'round(to-zero, 5, infinity)',
);
