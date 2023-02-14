import { convert } from '@csstools/css-calc';
import assert from 'assert';

assert.strictEqual(
	convert('min(1s)'),
	'1s',
);

assert.strictEqual(
	convert('min(1ms)'),
	'1ms',
);

assert.strictEqual(
	convert('max(1s)'),
	'1s',
);

assert.strictEqual(
	convert('max(1ms)'),
	'1ms',
);

assert.strictEqual(
	convert('min(1s, 2s)'),
	'1s',
);

assert.strictEqual(
	convert('min(1ms, 2ms)'),
	'1ms',
);

assert.strictEqual(
	convert('max(1s, 2s)'),
	'2s',
);

assert.strictEqual(
	convert('max(1ms, 2ms)'),
	'2ms',
);

assert.strictEqual(
	convert('min(1s, 1100ms)'),
	'1s',
);

assert.strictEqual(
	convert('max(0.9s, 1000ms)'),
	'1s',
);

assert.strictEqual(
	convert('min(2s, max(1s, 1500ms))'),
	'1.5s',
);

assert.strictEqual(
	convert('max(1000ms, min(2000ms, 1.5s))'),
	'1500ms',
);

assert.strictEqual(
	convert('calc(min(0.5s, 600ms) + 500ms)'),
	'1s',
);

assert.strictEqual(
	convert('calc(0ms + min(0.6s, 700ms) - 500ms)'),
	'100ms',
);

assert.strictEqual(
	convert('calc(min(0.5s, 600ms) * 2)'),
	'1s',
);

assert.strictEqual(
	convert('calc(min(0.5s, 600ms) / 2)'),
	'0.25s',
);

assert.strictEqual(
	convert('calc(max(0.5s, 400ms) + 500ms)'),
	'1s',
);

assert.strictEqual(
	convert('calc(0ms + max(0.5s, 400ms) - 400ms)'),
	'100ms',
);

assert.strictEqual(
	convert('calc(max(0.5s, 400ms) * 2)'),
	'1s',
);

assert.strictEqual(
	convert('calc(max(0.5s, 400ms) / 2)'),
	'0.25s',
);

assert.strictEqual(
	convert('calc(min(0.5s, 600ms) + max(500ms, 0.4s))'),
	'1s',
);

assert.strictEqual(
	convert('calc(0ms + min(0.6s, 700ms) - max(500ms, 0.4s))'),
	'100ms',
);

assert.strictEqual(
	convert('min(1s + 100ms, 500ms * 3)'),
	'1.1s',
);

assert.strictEqual(
	convert('calc(min(1s, 2s) + max(3s, 4s) + 10s)'),
	'15s',
);
