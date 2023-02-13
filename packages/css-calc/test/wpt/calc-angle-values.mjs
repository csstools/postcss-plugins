import { convert } from '@csstools/css-calc';
import assert from 'assert';

assert.strictEqual(
	convert('calc(45deg + 45deg)'),
	'90deg',
);

assert.strictEqual(
	convert('calc(45deg + 1rad)'),
	'102.29577951308232deg',
);

assert.strictEqual(
	convert('calc(20deg + 200grad)'),
	'200deg',
);

assert.strictEqual(
	convert('calc(200deg + 0.5turn)'),
	'380deg',
);

assert.strictEqual(
	convert('calc(45rad + 45rad)'),
	'90rad',
);

assert.strictEqual(
	convert('calc(0deg + (1rad + 40grad))'),
	'93.29577951308232deg',
);

assert.strictEqual(
	convert('calc(1rad + 0.5turn)'),
	'4.141592653589793rad',
);

assert.strictEqual(
	convert('calc(0deg + (1rad + 0.5turn))'),
	'237.29577951308232deg',
);

assert.strictEqual(
	convert('calc(45grad + 45grad)'),
	'90grad',
);

assert.strictEqual(
	convert('calc(10grad + 0.5turn)'),
	'210grad',
);

assert.strictEqual(
	convert('calc(0deg + (10grad + 0.5turn))'),
	'189deg',
);

assert.strictEqual(
	convert('calc(0deg + 10grad)'),
	'9deg',
);

assert.strictEqual(
	convert('calc(0deg + 0.5turn)'),
	'180deg',
);

assert.strictEqual(
	convert('calc(0grad + 189deg)'),
	'210grad',
);

assert.strictEqual(
	convert('calc(45deg - 15deg)'),
	'30deg',
);

assert.strictEqual(
	convert('rotate(calc(90deg - 1rad))'),
	'rotate(32.70422048691768deg)',
);

assert.strictEqual(
	convert('rotate(calc(38deg - 20grad))'),
	'rotate(20deg)',
);

assert.strictEqual(
	convert('rotate(calc(360deg - 0.5turn))'),
	'rotate(180deg)',
);

assert.strictEqual(
	convert('rotate(calc(45rad - 15rad))'),
	'rotate(30rad)',
);

assert.strictEqual(
	convert('rotate(calc(30rad - 10grad))'),
	'rotate(29.84292036732051rad)',
);

assert.strictEqual(
	convert('rotate(calc(0deg + (30rad - 10grad)))'),
	'rotate(1709.8733853924696deg)',
);

assert.strictEqual(
	convert('rotate(calc(4rad - 0.1turn))'),
	'rotate(3.3716814692820414rad)',
);

assert.strictEqual(
	convert('rotate(calc(0deg + (4rad - 0.1turn)))'),
	'rotate(193.18311805232932deg)',
);

assert.strictEqual(
	convert('rotate(calc(45grad - 15grad))'),
	'rotate(30grad)',
);

assert.strictEqual(
	convert('rotate(calc(100grad - 0.25turn))'),
	'rotate(0grad)',
);

assert.strictEqual(
	convert('rotate(calc(0deg + 100grad - 0.25turn))'),
	'rotate(0deg)',
);

assert.strictEqual(
	convert('rotate(calc(45deg * 2))'),
	'rotate(90deg)',
);

assert.strictEqual(
	convert('rotate(calc(2 * 45rad))'),
	'rotate(90rad)',
);

assert.strictEqual(
	convert('rotate(calc(45grad * 2))'),
	'rotate(90grad)',
);

assert.strictEqual(
	convert('rotate(calc(2 * 45turn))'),
	'rotate(90turn)',
);

assert.strictEqual(
	convert('rotate(calc(90deg / 2))'),
	'rotate(45deg)',
);

assert.strictEqual(
	convert('rotate(calc(90rad / 2))'),
	'rotate(45rad)',
);

assert.strictEqual(
	convert('rotate(calc(90grad / 2))'),
	'rotate(45grad)',
);

assert.strictEqual(
	convert('rotate(calc(90turn / 2))'),
	'rotate(45turn)',
);

assert.strictEqual(
	convert('rotate(calc(50grad + 5grad)'),
	'rotate(55grad',
);
