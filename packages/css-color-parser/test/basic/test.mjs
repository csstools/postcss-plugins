import { calc } from '@csstools/css-calc';
import assert from 'assert';

assert.strictEqual(
	calc('calc(10 * 2)'),
	(10 * 2).toString(),
);
