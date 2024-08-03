import { calc } from '@csstools/css-calc';
import assert from 'node:assert';

assert.strictEqual(
	calc('0 calc(var(--my-var) * -1) 0 0'),
	'0 calc(var(--my-var) * -1) 0 0',
);

assert.strictEqual(
	calc('0 calc(5px * -1) 0 0'),
	'0 -5px 0 0',
);

assert.strictEqual(
	calc('0 calc(-1 * var(--my-var)) 0 0'),
	'0 calc(-1 * var(--my-var)) 0 0',
);

assert.strictEqual(
	calc('0 calc(-1 * 5px) 0 0'),
	'0 -5px 0 0',
);
