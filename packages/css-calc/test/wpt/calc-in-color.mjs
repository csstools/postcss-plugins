import { convert } from '@csstools/css-calc';
import assert from 'assert';

assert.strictEqual(
	convert('rgb(calc(0), calc(255 + 0), calc(140 - 139 - 1))'),
	'rgb(0, 255, 0)',
);

assert.strictEqual(
	convert('rgba(calc(0%) calc(100%) calc(0%) / calc(10% * 10))'),
	'rgba(0% 100% 0% / 100%)',
);

assert.strictEqual(
	convert('hsl(calc(5deg * (360 / 5)), calc(10% * 10), calc(10% * 10))'),
	'hsl(360deg, 100%, 100%)',
);

assert.strictEqual(
	convert('hsla(calc(5 * (360 / 5)), calc(10% * 5), calc(10% * 8), calc(1.0))'),
	'hsla(360, 50%, 80%, 1.0)',
);
