import test from 'node:test';
import assert from 'node:assert';
import process from 'node:process';
import { calc } from '@csstools/css-calc';
import { generateCases } from './generate.mjs';

const CONFIGS = [
	{ name: 'default', options: {} },
	{ name: 'canonical-units', options: { toCanonicalUnits: true } },
	{ name: 'raw-percentages', options: { rawPercentages: true } },
	{ name: 'censored', options: { censorIntoStandardRepresentableValues: true } },
];

// Expressions that exercise options and code paths which are not part of the
// general generated grammar:
// - `random()` needs `randomCaching`
// - `calc-mix()` needs the parser to keep the mix percentage
// - `round(line-width, ...)` needs `devicePixelLength`
// - `onParseError` needs a callback
const targetedExpressions = [
	'random(100px, 500px)',
	'random(fixed 0.5, 100px, 500px)',
	'random(auto, 100px, 500px)',
	'random(element-scoped, 100px, 500px)',
	'random(--foo, 100px, 500px)',
	'random(100px, NaN)',
	'calc-mix(10px, 20px)',
	'calc-mix(in srgb, red 40%, blue)',
	'calc(round(line-width, 1.2345px))',
	'round(line-width, 1.2345px)',
	'clamp(1px, 2px, none)',
	'clamp(none, 2px, 3px)',
	'clamp(1px, none, 3px)',
	'calc(1px + )',
	'calc(1 + )',
	'calc(1px + 2)',
	'calc(2 - 1px)',
	'round(1 + )',
];

const randomCaching = {
	documentID: 'a',
	elementID: 'b',
	propertyName: 'width',
	propertyN: 0,
};

// Large Node-only fuzz run.
//
// This does not launch a browser. It is used to:
// - make sure no generated expression crashes `css-calc`
// - measure function coverage of `dist/index.mjs` via
//   `npm run test:coverage`
test('fuzz', () => {
	const count = Number(process.env.FUZZ_ITERATIONS ?? 50000);
	const cases = [...targetedExpressions, ...generateCases({ seed: 1, count })];

	for (const expression of cases) {
		for (const config of CONFIGS) {
			assert.doesNotThrow(() => calc(expression, { ...config.options, randomCaching, devicePixelLength: 0.021, onParseError: () => { /* noop */ } }), `calc(${JSON.stringify(expression)}) threw for config ${config.name}`);
		}
	}
});
