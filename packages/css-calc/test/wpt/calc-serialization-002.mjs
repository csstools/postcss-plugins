import { calc } from '@csstools/css-calc';
import assert from 'node:assert';

assert.strictEqual(
	calc('calc(5mm + 1in)'),
	'30.4mm',
);
