import { calc } from '@csstools/css-calc';
import assert from 'node:assert';

assert.strictEqual(
	calc('round(line-width, 0.001px)'),
	'1px',
);

assert.strictEqual(
	calc('round(line-width, 0px)'),
	'0px',
);

assert.strictEqual(
	calc('round(line-width, 1)'),
	'round(line-width, 1)',
);

assert.strictEqual(
	calc('round(line-width, -1)'),
	'round(line-width, -1)',
);

assert.strictEqual(
	calc('round(line-width, 1, 0.5)'),
	'round(line-width, 1, 0.5)',
);

assert.strictEqual(
	calc('round(line-width, -1, 0.5)'),
	'round(line-width, -1, 0.5)',
);

assert.strictEqual(
	calc('round(line-width, -1px)'),
	'-1px',
);

assert.strictEqual(
	calc('round(line-width, 0.001px)', { devicePixelLength: 0.5 }),
	'0.5px',
);

assert.strictEqual(
	calc('round(line-width, 23.45343px)', { devicePixelLength: 0.5 }),
	'23px',
);

assert.strictEqual(
	calc('round(line-width, 23.45343px, 11px)', { devicePixelLength: 0.5 }),
	'22px',
);

assert.strictEqual(
	calc('round(line-width, 5px, 1.3px)', { devicePixelLength: 0.5 }),
	'5px',
);

assert.strictEqual(
	calc('round(line-width, 5px, 1.6px)', { devicePixelLength: 0.5 }),
	'4.5px',
);

assert.strictEqual(
	calc('round(line-width, 5px, 1.7px)', { devicePixelLength: 0.5 }),
	'5px',
);

assert.strictEqual(
	calc('round(line-width, 5px, 1.8px)', { devicePixelLength: 0.5 }),
	'5px',
);

assert.strictEqual(
	calc('round(line-width, 5px, 1.9px)', { devicePixelLength: 0.5 }),
	'5.5px',
);

assert.strictEqual(
	calc('round(line-width, 5px, 2px)', { devicePixelLength: 0.5 }),
	'6px',
);

assert.strictEqual(
	calc('round(line-width, 5pt, 2pt)', { devicePixelLength: 0.5 }),
	'6pt',
);

assert.strictEqual(
	calc('round(line-width, 5mm, 2mm)', { devicePixelLength: 0.5 }),
	'5.953125mm',
);

assert.strictEqual(
	calc('round(line-width, -5px, 2px)', { devicePixelLength: 0.5 }),
	'-4px',
);

assert.strictEqual(
	calc('round(line-width, 0.25px)', { devicePixelLength: 0.5 }),
	'0.5px',
);

assert.strictEqual(
	calc('round(line-width, 0.99px)', { devicePixelLength: 0.5 }),
	'0.5px',
);

assert.strictEqual(
	calc('round(line-width, 0.99px, 0.01px)', { devicePixelLength: 0.5 }),
	'0.5px',
);

assert.strictEqual(
	calc('round(line-width, 0.29px, 0.2px)', { devicePixelLength: 0.3 }),
	'0.3px',
);

assert.strictEqual(
	calc('round(line-width, 0.29px)', { devicePixelLength: 0.3 }),
	'0.3px',
);

assert.strictEqual(
	calc('round(line-width, 0.31px, 0.2px)', { devicePixelLength: 0.3 }),
	'0.3px',
);

assert.strictEqual(
	calc('round(line-width, 0.31px)', { devicePixelLength: 0.3 }),
	'0.3px',
);

assert.strictEqual(
	calc('round(line-width, 0.39px, 0.2px)', { devicePixelLength: 0.3 }),
	'0.3px',
);

assert.strictEqual(
	calc('round(line-width, 0.39px)', { devicePixelLength: 0.3 }),
	'0.3px',
);

assert.strictEqual(
	calc('round(line-width, 0.41px, 0.2px)', { devicePixelLength: 0.3 }),
	'0.3px',
);

assert.strictEqual(
	calc('round(line-width, 0.41px)', { devicePixelLength: 0.3 }),
	'0.3px',
);

assert.strictEqual(
	calc('round(line-width, 0.49px, 0.2px)', { devicePixelLength: 0.3 }),
	'0.3px',
);

assert.strictEqual(
	calc('round(line-width, 0.49px)', { devicePixelLength: 0.3 }),
	'0.3px',
);

assert.strictEqual(
	calc('round(line-width, 0.51px, 0.2px)', { devicePixelLength: 0.3 }),
	'0.6px',
);

assert.strictEqual(
	calc('round(line-width, 0.51px)', { devicePixelLength: 0.3 }),
	'0.3px',
);

assert.strictEqual(
	calc('round(line-width, 0.49px)', { devicePixelLength: 0.5 }),
	'0.5px',
);

assert.strictEqual(
	calc('round(line-width, 0.49px, 0.01px)', { devicePixelLength: 0.5 }),
	'0.5px',
);

assert.strictEqual(
	calc('round(line-width, 1.01px)', { devicePixelLength: 0.5 }),
	'1px',
);

assert.strictEqual(
	calc('round(line-width, 1.01px, 0.01px)', { devicePixelLength: 0.5 }),
	'1px',
);

assert.strictEqual(
	calc('round(line-width, 0.51px)', { devicePixelLength: 0.5 }),
	'0.5px',
);

assert.strictEqual(
	calc('round(line-width, 0.51px, 0.01px)', { devicePixelLength: 0.5 }),
	'0.5px',
);

assert.strictEqual(
	calc('round(line-width, -0.99px)', { devicePixelLength: 0.5 }),
	'-0.5px',
);

assert.strictEqual(
	calc('round(line-width, -0.99px, 0.01px)', { devicePixelLength: 0.5 }),
	'-0.5px',
);

assert.strictEqual(
	calc('round(line-width, -1.01px)', { devicePixelLength: 0.5 }),
	'-1px',
);

assert.strictEqual(
	calc('round(line-width, -1.01px, 0.01px)', { devicePixelLength: 0.5 }),
	'-1px',
);

assert.strictEqual(
	calc('round(line-width, 11)', { devicePixelLength: 0.5 }),
	'round(line-width, 11)',
);

assert.strictEqual(
	calc('round(line-width, 11, 1)', { devicePixelLength: 0.5 }),
	'round(line-width, 11, 1)',
);

assert.strictEqual(
	calc('round(line-width, 11px, 1)', { devicePixelLength: 0.5 }),
	'round(line-width, 11px, 1)',
);
