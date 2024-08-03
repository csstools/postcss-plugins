import { calc } from '@csstools/css-calc';
import assert from 'node:assert';

assert.strictEqual(
	calc('calc(100px * 0 / 0)'),
	'calc(NaN * 1px)',
);

assert.strictEqual(
	calc('calc(100px / 0)'),
	'calc(infinity * 1px)',
);

assert.strictEqual(
	calc('calc(100px / (0))'),
	'calc(infinity * 1px)',
);

assert.strictEqual(
	calc('calc(100px / (2 - 2))'),
	'calc(infinity * 1px)',
);

assert.strictEqual(
	calc('calc(100px / (2 - (-62 + 64)))'),
	'calc(infinity * 1px)',
);

assert.strictEqual(
	calc('calc(100px * (1 / 0))'),
	'calc(infinity * 1px)',
);

assert.strictEqual(
	calc('calc(100px * (1 / (0)))'),
	'calc(infinity * 1px)',
);

assert.strictEqual(
	calc('calc(100px * (1 / (2 - 2)))'),
	'calc(infinity * 1px)',
);

assert.strictEqual(
	calc('calc(100px * (1 / (2 - (-62 + 64))))'),
	'calc(infinity * 1px)',
);

assert.strictEqual(
	calc('calc(1px * max(1/0, 0))'),
	'calc(infinity * 1px)',
);

assert.strictEqual(
	calc('calc(1px * min(1/0, 0))'),
	'0px',
);

assert.strictEqual(
	calc('calc(1px * max(0/0, 0))'),
	'calc(NaN * 1px)',
);

assert.strictEqual(
	calc('calc(1px * min(0/0, 0))'),
	'calc(NaN * 1px)',
);

assert.strictEqual(
	calc('calc(1px * max(0/0, min(0,10)))'),
	'calc(NaN * 1px)',
);

assert.strictEqual(
	calc('calc(1px * clamp(0/0, 0, 10))'),
	'calc(NaN * 1px)',
);

assert.strictEqual(
	calc('calc(1px * max(0, min(10, 0/0)))'),
	'calc(NaN * 1px)',
);

assert.strictEqual(
	calc('calc(1px * clamp(0, 10, 0/0))'),
	'calc(NaN * 1px)',
);

assert.strictEqual(
	calc('calc(1px * max(0, min(0/0, 10)))'),
	'calc(NaN * 1px)',
);

assert.strictEqual(
	calc('calc(1px * clamp(0, 0/0, 10))'),
	'calc(NaN * 1px)',
);

assert.strictEqual(
	calc('calc(1px * clamp(-1/0, 0, 1/0))'),
	'0px',
);

assert.strictEqual(
	calc('calc(1px * clamp(-1/0, 1/0, 10))'),
	'10px',
);
