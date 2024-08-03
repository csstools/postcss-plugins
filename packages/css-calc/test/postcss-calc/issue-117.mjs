import { calc } from '@csstools/css-calc';
import assert from 'node:assert';

assert.strictEqual(
	calc('calc(min(max(var(--foo), 0), 100))'),
	'calc(min(max(var(--foo), 0), 100))',
);

assert.strictEqual(
	calc('calc(min(max(5, 0), 100))'),
	'5',
);
