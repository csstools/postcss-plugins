import { convert } from '@csstools/css-calc';
import assert from 'assert';

assert.strictEqual(
	convert('calc(5mm + 1in)'),
	'30.4mm',
);
