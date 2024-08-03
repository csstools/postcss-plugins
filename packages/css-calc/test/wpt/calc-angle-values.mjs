import { calc } from '@csstools/css-calc';
import assert from 'node:assert';

assert.strictEqual(
	calc('calc(45deg + 45deg)'),
	'90deg',
);

assert.strictEqual(
	calc('calc(45deg + 1rad)'),
	'102.2957795130823deg',
);

assert.strictEqual(
	calc('calc(20deg + 200grad)'),
	'200deg',
);

assert.strictEqual(
	calc('calc(200deg + 0.5turn)'),
	'380deg',
);

assert.strictEqual(
	calc('calc(45rad + 45rad)'),
	'90rad',
);

assert.strictEqual(
	calc('calc(0deg + (1rad + 40grad))'),
	'93.2957795130823deg',
);

assert.strictEqual(
	calc('calc(1rad + 0.5turn)'),
	'4.1415926535898rad',
);

assert.strictEqual(
	calc('calc(0deg + (1rad + 0.5turn))'),
	'237.2957795130823deg',
);

assert.strictEqual(
	calc('calc(45grad + 45grad)'),
	'90grad',
);

assert.strictEqual(
	calc('calc(10grad + 0.5turn)'),
	'210grad',
);

assert.strictEqual(
	calc('calc(0deg + (10grad + 0.5turn))'),
	'189deg',
);

assert.strictEqual(
	calc('calc(0deg + 10grad)'),
	'9deg',
);

assert.strictEqual(
	calc('calc(0deg + 0.5turn)'),
	'180deg',
);

assert.strictEqual(
	calc('calc(0grad + 189deg)'),
	'210grad',
);

assert.strictEqual(
	calc('calc(45deg - 15deg)'),
	'30deg',
);

assert.strictEqual(
	calc('rotate(calc(90deg - 1rad))'),
	'rotate(32.7042204869177deg)',
);

assert.strictEqual(
	calc('rotate(calc(38deg - 20grad))'),
	'rotate(20deg)',
);

assert.strictEqual(
	calc('rotate(calc(360deg - 0.5turn))'),
	'rotate(180deg)',
);

assert.strictEqual(
	calc('rotate(calc(45rad - 15rad))'),
	'rotate(30rad)',
);

assert.strictEqual(
	calc('rotate(calc(30rad - 10grad))'),
	'rotate(29.8429203673205rad)',
);

assert.strictEqual(
	calc('rotate(calc(0deg + (30rad - 10grad)))'),
	'rotate(1709.8733853924696deg)',
);

assert.strictEqual(
	calc('rotate(calc(4rad - 0.1turn))'),
	'rotate(3.371681469282rad)',
);

assert.strictEqual(
	calc('rotate(calc(0deg + (4rad - 0.1turn)))'),
	'rotate(193.1831180523293deg)',
);

assert.strictEqual(
	calc('rotate(calc(45grad - 15grad))'),
	'rotate(30grad)',
);

assert.strictEqual(
	calc('rotate(calc(100grad - 0.25turn))'),
	'rotate(0grad)',
);

assert.strictEqual(
	calc('rotate(calc(0deg + 100grad - 0.25turn))'),
	'rotate(0deg)',
);

assert.strictEqual(
	calc('rotate(calc(45deg * 2))'),
	'rotate(90deg)',
);

assert.strictEqual(
	calc('rotate(calc(2 * 45rad))'),
	'rotate(90rad)',
);

assert.strictEqual(
	calc('rotate(calc(45grad * 2))'),
	'rotate(90grad)',
);

assert.strictEqual(
	calc('rotate(calc(2 * 45turn))'),
	'rotate(90turn)',
);

assert.strictEqual(
	calc('rotate(calc(90deg / 2))'),
	'rotate(45deg)',
);

assert.strictEqual(
	calc('rotate(calc(90rad / 2))'),
	'rotate(45rad)',
);

assert.strictEqual(
	calc('rotate(calc(90grad / 2))'),
	'rotate(45grad)',
);

assert.strictEqual(
	calc('rotate(calc(90turn / 2))'),
	'rotate(45turn)',
);

assert.strictEqual(
	calc('rotate(calc(50grad + 5grad)'),
	'rotate(55grad',
);
