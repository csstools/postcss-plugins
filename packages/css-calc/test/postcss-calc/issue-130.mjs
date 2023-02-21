import { calc } from '@csstools/css-calc';
import assert from 'assert';

assert.strictEqual(
	calc(`calc(
				1
				* clamp(
						1 ,
						((1 * 1) * 1) ,
						1
				)
		)`),
	'1',
);
