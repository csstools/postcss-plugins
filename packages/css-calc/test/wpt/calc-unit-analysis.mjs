import { calc } from '@csstools/css-calc';
import assert from 'assert';

assert.strictEqual(
	calc('calc(0)'),
	'0',
);

assert.strictEqual(
	calc('calc(0px)'),
	'0px',
);

assert.strictEqual(
	calc('calc(1px + 2)'),
	'calc(1px + 2)', // invalid, so input is not modified
);

assert.strictEqual(
	calc('calc(2 + 1px)'),
	'calc(2 + 1px)', // invalid, so input is not modified
);

assert.strictEqual(
	calc('calc(1px - 2)'),
	'calc(1px - 2)', // invalid, so input is not modified
);

assert.strictEqual(
	calc('calc(2 - 1px)'),
	'calc(2 - 1px)', // invalid, so input is not modified
);

assert.strictEqual(
	calc('calc(2px * 2)'),
	'4px',
);

assert.strictEqual(
	calc('calc(2 * 2px)'),
	'4px',
);

assert.strictEqual(
	calc('calc(2px * 1px)'),
	'calc(2px * 1px)', // invalid, so input is not modified
);
