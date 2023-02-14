import { convert } from '@csstools/css-calc';
import assert from 'assert';

assert.strictEqual(
	convert('min(1)'),
	'1',
);

assert.strictEqual(
	convert('max(1)'),
	'1',
);

assert.strictEqual(
	convert('min(0.2, max(0.1, 0.15))'),
	'0.15',
);

assert.strictEqual(
	convert('max(0.1, min(0.2, 0.15))'),
	'0.15',
);

assert.strictEqual(
	convert('calc(min(0.1, 0.2) + 0.05)'),
	'0.15000000000000002',
);

assert.strictEqual(
	convert('calc(min(0.1, 0.2) - 0.05)'),
	'0.05',
);

assert.strictEqual(
	convert('calc(min(0.1, 0.2) * 2)'),
	'0.2',
);

assert.strictEqual(
	convert('calc(min(0.1, 0.2) / 2)'),
	'0.05',
);

assert.strictEqual(
	convert('calc(max(0.1, 0.2) + 0.05)'),
	'0.25',
);

assert.strictEqual(
	convert('calc(max(0.1, 0.2) - 0.05)'),
	'0.15000000000000002',
);

assert.strictEqual(
	convert('calc(max(0.1, 0.2) * 2)'),
	'0.4',
);

assert.strictEqual(
	convert('calc(max(0.1, 0.2) / 2)'),
	'0.1',
);

assert.strictEqual(
	convert('calc(min(0.1, 0.2) + max(0.1, 0.05))'),
	'0.2',
);

assert.strictEqual(
	convert('calc(min(0.1, 0.2) - max(0.1, 0.05))'),
	'0',
);
