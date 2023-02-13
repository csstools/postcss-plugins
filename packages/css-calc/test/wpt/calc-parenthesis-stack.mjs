import { convert } from '@csstools/css-calc';
import assert from 'assert';

assert.strictEqual(
	convert('calc((((((((((((((((((((((((((((((((100%))))))))))))))))))))))))))))))))'),
	'100%',
);
