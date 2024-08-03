import { calc } from '@csstools/css-calc';
import assert from 'node:assert';

assert.strictEqual(
	calc('calc((((((((((((((((((((((((((((((((100%))))))))))))))))))))))))))))))))'),
	'100%',
);
