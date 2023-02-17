import { calc } from '@csstools/css-calc';
import assert from 'assert';

assert.strictEqual(
	calc('calc(120rpx - 41.7rpx)'),
	'78.3rpx',
);
