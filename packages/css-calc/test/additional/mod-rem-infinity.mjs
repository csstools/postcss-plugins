import { convert } from '@csstools/css-calc';
import assert from 'assert';

assert.strictEqual(
	convert('mod(infinity, infinity)'),
	'calc(NaN)',
);

assert.strictEqual(
	convert('mod(-infinity, infinity)'),
	'calc(NaN)',
);

assert.strictEqual(
	convert('mod(-infinity, -infinity)'),
	'calc(NaN)',
);

assert.strictEqual(
	convert('mod(infinity, -infinity)'),
	'calc(NaN)',
);

assert.strictEqual(
	convert('mod(0, infinity)'),
	'0',
);

assert.strictEqual(
	convert('mod(-0, infinity)'),
	'calc(NaN)',
);

assert.strictEqual(
	convert('mod(0, -infinity)'),
	'calc(NaN)',
);

assert.strictEqual(
	convert('mod(-0, -infinity)'),
	'-0',
);

assert.strictEqual(
	convert('mod(infinity, 0)'),
	'calc(NaN)',
);

assert.strictEqual(
	convert('mod(-infinity, 0)'),
	'calc(NaN)',
);

assert.strictEqual(
	convert('mod(-infinity, -0)'),
	'calc(NaN)',
);

assert.strictEqual(
	convert('mod(infinity, -0)'),
	'calc(NaN)',
);

assert.strictEqual(
	convert('rem(infinity, infinity)'),
	'calc(NaN)',
);

assert.strictEqual(
	convert('rem(-infinity, infinity)'),
	'calc(NaN)',
);

assert.strictEqual(
	convert('rem(-infinity, -infinity)'),
	'calc(NaN)',
);

assert.strictEqual(
	convert('rem(infinity, -infinity)'),
	'calc(NaN)',
);

assert.strictEqual(
	convert('rem(0, infinity)'),
	'0',
);

assert.strictEqual(
	convert('rem(-0, infinity)'),
	'-0',
);

assert.strictEqual(
	convert('rem(0, -infinity)'),
	'0',
);

assert.strictEqual(
	convert('rem(-0, -infinity)'),
	'-0',
);

assert.strictEqual(
	convert('rem(infinity, 0)'),
	'calc(NaN)',
);

assert.strictEqual(
	convert('rem(-infinity, 0)'),
	'calc(NaN)',
);

assert.strictEqual(
	convert('rem(-infinity, -0)'),
	'calc(NaN)',
);

assert.strictEqual(
	convert('rem(infinity, -0)'),
	'calc(NaN)',
);
