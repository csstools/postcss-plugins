import { calc } from '@csstools/css-calc';
import assert from 'node:assert';

assert.strictEqual(
	calc('min(1%)'),
	'1%',
);

assert.strictEqual(
	calc('max(1%)'),
	'1%',
);

assert.strictEqual(
	calc('min(20%, max(10%, 15%))'),
	'15%',
);

assert.strictEqual(
	calc('max(10%, min(20%, 15%))'),
	'15%',
);

assert.strictEqual(
	calc('calc(min(10%, 20%) + 5%)'),
	'15%',
);

assert.strictEqual(
	calc('calc(min(10%, 20%) - 5%)'),
	'5%',
);

assert.strictEqual(
	calc('calc(min(10%, 20%) * 2)'),
	'20%',
);

assert.strictEqual(
	calc('calc(min(10%, 20%) / 2)'),
	'5%',
);

assert.strictEqual(
	calc('calc(max(10%, 20%) + 5%)'),
	'25%',
);

assert.strictEqual(
	calc('calc(max(10%, 20%) - 5%)'),
	'15%',
);

assert.strictEqual(
	calc('calc(max(10%, 20%) * 2)'),
	'40%',
);

assert.strictEqual(
	calc('calc(max(10%, 20%) / 2)'),
	'10%',
);

assert.strictEqual(
	calc('calc(min(10%, 20%) + max(10%, 5%))'),
	'20%',
);

assert.strictEqual(
	calc('calc(min(11%, 20%) - max(10%, 5%))'),
	'1%',
);
