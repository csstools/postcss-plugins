import { calc } from '@csstools/css-calc';
import assert from 'node:assert';

assert.strictEqual(
	calc('min(1)'),
	'1',
);

assert.strictEqual(
	calc('max(1)'),
	'1',
);

assert.strictEqual(
	calc('min(0.2, max(0.1, 0.15))'),
	'0.15',
);

assert.strictEqual(
	calc('max(0.1, min(0.2, 0.15))'),
	'0.15',
);

assert.strictEqual(
	calc('calc(min(0.1, 0.2) + 0.05)'),
	'0.15',
);

assert.strictEqual(
	calc('calc(min(0.1, 0.2) - 0.05)'),
	'0.05',
);

assert.strictEqual(
	calc('calc(min(0.1, 0.2) * 2)'),
	'0.2',
);

assert.strictEqual(
	calc('calc(min(0.1, 0.2) / 2)'),
	'0.05',
);

assert.strictEqual(
	calc('calc(max(0.1, 0.2) + 0.05)'),
	'0.25',
);

assert.strictEqual(
	calc('calc(max(0.1, 0.2) - 0.05)'),
	'0.15',
);

assert.strictEqual(
	calc('calc(max(0.1, 0.2) * 2)'),
	'0.4',
);

assert.strictEqual(
	calc('calc(max(0.1, 0.2) / 2)'),
	'0.1',
);

assert.strictEqual(
	calc('calc(min(0.1, 0.2) + max(0.1, 0.05))'),
	'0.2',
);

assert.strictEqual(
	calc('calc(min(0.1, 0.2) - max(0.1, 0.05))'),
	'0',
);
