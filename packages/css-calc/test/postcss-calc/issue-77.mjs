import { calc } from '@csstools/css-calc';
import assert from 'node:assert';

assert.strictEqual(
	calc('calc(var(--b, calc(var(--c) * 1)))'),
	'calc(var(--b, calc(var(--c) * 1)))',
);

assert.strictEqual(
	calc('calc(var(--b, calc(10 * 1)))'),
	'calc(var(--b, 10))',
);
