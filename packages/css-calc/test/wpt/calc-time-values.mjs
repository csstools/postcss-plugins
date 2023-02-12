import { convert } from '@csstools/css-calc';
import assert from 'assert';

assert.strictEqual(
	convert('calc(4s + 1s)'),
	'5s',
);

assert.strictEqual(
	convert('calc(4s + 1ms)'),
	'4.001s',
);

assert.strictEqual(
	convert('calc(4ms + 1ms)'),
	'5ms',
);

assert.strictEqual(
	convert('calc(4s - 1s)'),
	'3s',
);

assert.strictEqual(
	convert('calc(4s - 1ms)'),
	'3.999s',
);

assert.strictEqual(
	convert('calc(4 * 1s)'),
	'4s',
);

assert.strictEqual(
	convert('calc(4 * 1ms)'),
	'4ms',
);

assert.strictEqual(
	convert('calc(4s / 2)'),
	'2s',
);

assert.strictEqual(
	convert('calc(4ms / 2)'),
	'2ms',
);

assert.strictEqual(
	convert('max(1s, 4ms)'),
	'1s',
);

assert.strictEqual(
	convert('max(4ms, 1s)'),
	'1000ms',
);

assert.strictEqual(
	convert('min(1s, 4ms)'),
	'0.004s',
);

assert.strictEqual(
	convert('min(4ms, 1s)'),
	'4ms',
);
