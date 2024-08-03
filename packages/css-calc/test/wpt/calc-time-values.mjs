import { calc } from '@csstools/css-calc';
import assert from 'node:assert';

assert.strictEqual(
	calc('calc(4s + 1s)'),
	'5s',
);

assert.strictEqual(
	calc('calc(4s + 1ms)'),
	'4.001s',
);

assert.strictEqual(
	calc('calc(4ms + 1ms)'),
	'5ms',
);

assert.strictEqual(
	calc('calc(4s - 1s)'),
	'3s',
);

assert.strictEqual(
	calc('calc(4s - 1ms)'),
	'3.999s',
);

assert.strictEqual(
	calc('calc(4 * 1s)'),
	'4s',
);

assert.strictEqual(
	calc('calc(4 * 1ms)'),
	'4ms',
);

assert.strictEqual(
	calc('calc(4s / 2)'),
	'2s',
);

assert.strictEqual(
	calc('calc(4ms / 2)'),
	'2ms',
);

assert.strictEqual(
	calc('max(1s, 4ms)'),
	'1s',
);

assert.strictEqual(
	calc('max(4ms, 1s)'),
	'1000ms',
);

assert.strictEqual(
	calc('min(1s, 4ms)'),
	'0.004s',
);

assert.strictEqual(
	calc('min(4ms, 1s)'),
	'4ms',
);
