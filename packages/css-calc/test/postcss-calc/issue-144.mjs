import { convert } from '@csstools/css-calc';
import assert from 'assert';

assert.strictEqual(
	convert('calc(100% / 3)'),
	'33.3333333333333%',
);
