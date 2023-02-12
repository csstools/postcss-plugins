import { convert } from '@csstools/css-calc';
import assert from 'assert';

assert.strictEqual(
	convert(`calc(
				1
				* clamp(
						1 ,
						((1 * 1) * 1) ,
						1
				)
		)`),
	'1',
);

