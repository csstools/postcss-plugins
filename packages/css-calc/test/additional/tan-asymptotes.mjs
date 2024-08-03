import { calc } from '@csstools/css-calc';
import assert from 'node:assert';

assert.strictEqual(
	calc('tan(90deg)'),
	'calc(infinity)',
);

assert.strictEqual(
	calc('tan(100grad)'),
	'calc(infinity)',
);

assert.strictEqual(
	calc('tan(270deg)'),
	'calc(infinity)',
);

assert.strictEqual(
	calc('tan(300grad)'),
	'calc(infinity)',
);

assert.strictEqual(
	calc('tan(-270deg)'),
	'calc(-infinity)',
);

assert.strictEqual(
	calc('tan(-100grad)'),
	'calc(-infinity)',
);

assert.strictEqual(
	calc('tan(-450deg)'),
	'calc(-infinity)',
);

assert.strictEqual(
	calc('tan(-300grad)'),
	'calc(-infinity)',
);
