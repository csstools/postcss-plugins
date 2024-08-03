import { calc } from '@csstools/css-calc';
import assert from 'node:assert';

assert.strictEqual(
	calc('rgb(calc(0), calc(255 + 0), calc(140 - 139 - 1))'),
	'rgb(0, 255, 0)',
);

assert.strictEqual(
	calc('rgba(calc(0%) calc(100%) calc(0%) / calc(10% * 10))'),
	'rgba(0% 100% 0% / 100%)',
);

assert.strictEqual(
	calc('hsl(calc(5deg * (360 / 5)), calc(10% * 10), calc(10% * 10))'),
	'hsl(360deg, 100%, 100%)',
);

assert.strictEqual(
	calc('hsla(calc(5 * (360 / 5)), calc(10% * 5), calc(10% * 8), calc(1.0))'),
	'hsla(360, 50%, 80%, 1.0)',
);
