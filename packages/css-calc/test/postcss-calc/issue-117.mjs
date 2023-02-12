import { convert } from '@csstools/css-calc';
import assert from 'assert';

assert.strictEqual(
	convert('calc(min(max(var(--foo), 0), 100))'),
	'calc(min(max(var(--foo), 0), 100))',
);

assert.strictEqual(
	convert('calc(min(max(5, 0), 100))'),
	'5',
);

