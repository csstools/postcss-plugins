import { calc } from '@csstools/css-calc';
import assert from 'node:assert';

assert.strictEqual(
	calc('min(1deg)'),
	'1deg',
);

assert.strictEqual(
	calc('min(1grad)'),
	'1grad',
);

assert.strictEqual(
	calc('min(1rad)'),
	'1rad',
);

assert.strictEqual(
	calc('min(1turn)'),
	'1turn',
);

assert.strictEqual(
	calc('max(1deg)'),
	'1deg',
);

assert.strictEqual(
	calc('max(1grad)'),
	'1grad',
);

assert.strictEqual(
	calc('max(1rad)'),
	'1rad',
);

assert.strictEqual(
	calc('max(1turn)'),
	'1turn',
);

assert.strictEqual(
	calc('min(1deg, 2deg)'),
	'1deg',
);

assert.strictEqual(
	calc('min(1grad, 2grad)'),
	'1grad',
);

assert.strictEqual(
	calc('min(1rad, 2rad)'),
	'1rad',
);

assert.strictEqual(
	calc('min(1turn, 2turn)'),
	'1turn',
);

assert.strictEqual(
	calc('max(1deg, 2deg)'),
	'2deg',
);

assert.strictEqual(
	calc('max(1grad, 2grad)'),
	'2grad',
);

assert.strictEqual(
	calc('max(1rad, 2rad)'),
	'2rad',
);

assert.strictEqual(
	calc('max(1turn, 2turn)'),
	'2turn',
);

assert.strictEqual(
	calc('min(90deg, 0.26turn)'),
	'90deg',
);

assert.strictEqual(
	calc('min(1.57rad, 95deg)'),
	'1.57rad',
);

assert.strictEqual(
	calc('max(91deg, 0.25turn)'),
	'91deg',
);

assert.strictEqual(
	calc('max(1.58rad, 90deg)'),
	'1.58rad',
);

assert.strictEqual(
	calc('min(270deg, max(0.25turn, 3.14rad))'),
	'179.9087476710785deg',
);

assert.strictEqual(
	calc('calc(0rad + min(270deg, max(0.25turn, 3.14rad)))'),
	'3.14rad',
);

assert.strictEqual(
	calc('max(0.25turn, min(270deg, 3.14rad))'),
	'0.4997465213086turn',
);

assert.strictEqual(
	calc('calc(0rad + max(0.25turn, min(270deg, 3.14rad)))'),
	'3.14rad',
);

assert.strictEqual(
	calc('calc(min(90deg, 1.58rad) + 0.25turn)'),
	'180deg',
);

assert.strictEqual(
	calc('calc(min(90deg, 1.58rad) - 0.125turn)'),
	'45deg',
);

assert.strictEqual(
	calc('calc(min(90deg, 1.58rad) * 2'),
	'180deg',
);

assert.strictEqual(
	calc('calc(min(90deg, 1.58rad) / 2'),
	'45deg',
);

assert.strictEqual(
	calc('calc(max(90deg, 1.56rad) + 0.25turn)'),
	'180deg',
);

assert.strictEqual(
	calc('calc(max(90deg, 1.56rad) - 0.125turn)'),
	'45deg',
);

assert.strictEqual(
	calc('calc(max(90deg, 1.56rad) * 2'),
	'180deg',
);

assert.strictEqual(
	calc('calc(max(90deg, 1.56rad) / 2'),
	'45deg',
);

assert.strictEqual(
	calc('calc(min(90deg, 1.58rad) + max(0.25turn, 99grad))'),
	'180deg',
);

assert.strictEqual(
	calc('calc(min(90deg, 1.58rad) - max(0.25turn, 99grad))'),
	'0deg',
);
