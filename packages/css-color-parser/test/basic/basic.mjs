import { color } from '@csstools/css-color-parser';
import assert from 'assert';
import { parse } from '../util/parse.mjs';
import { serialize_sRGB_data } from '../util/serialize.mjs';

[
	'rgb( )',
	'rgb(255 )',
	'rgb(255, )',
	'rgb(255, 0 )',
	'rgb(255, 0, )',
	'rgb(255, 0, foo(0))',
	'rgb(255, 0, var(--foo))',
	'rgb(255, 0, 0, )',
	'rgb(255, 0, 0, 0, )',
].forEach((testCase) => {
	assert.deepStrictEqual(
		color(parse(testCase)),
		false,
	);
});

[
	'rgb( )',
	'rgb(255 )',
	'rgb(255 0 )',
	'rgb(255 0 foo(0))',
	'rgb(255 0 var(--foo))',
	'rgb(255 0 0 / )',
	'rgb(255 0 0 / 0 0)',
	'rgb(255 0 0 / 0 / )',
	'rgb(255 0 0 / 0 / 0)',
].forEach((testCase) => {
	assert.deepStrictEqual(
		color(parse(testCase)),
		false,
	);
});

[
	'rgb( )',
	'rgb(calc(10% * 2) )',
	'rgb(calc(10% * 2), )',
	'rgb(calc(10% * 2), 0 )',
	'rgb(calc(10% * 2), 0, )',
	'rgb(calc(10% * 2), 0, foo(0))',
	'rgb(calc(10% * 2), 0, var(--foo))',
].forEach((testCase) => {
	assert.deepStrictEqual(
		color(parse(testCase)),
		false,
	);
});

[
	'rgb(20%, 0%, 0%)',
	'rgb( 20%, 0%, 0%)',
	'rgb(/**/20%, 0%, 0%)',
	'rgb(calc(10% * 2), 0%, 0%)',
].forEach((testCase) => {
	assert.deepStrictEqual(
		color(parse(testCase)),
		{
			colorNotation: 'rgb',
			channels: [0.2, 0, 0],
			alpha: 1,
			syntaxFlags: new Set([ 'legacy-rgb', 'has-percentage-values' ]),
		},
		testCase,
	);
});

[
	'rgb(20% 0 0)',
	'rgb( 20% 0 0)',
	'rgb(/**/20% 0 0)',
].forEach((testCase) => {
	assert.deepStrictEqual(
		color(parse(testCase)),
		{
			colorNotation: 'rgb',
			channels: [0.2, 0, 0],
			alpha: 1,
			syntaxFlags: new Set(['has-number-values', 'has-percentage-values']),
		},
	);
});

[
	'rgb(20%, 0%, 0%, 0.5)',
	'rgb(calc(10% * 2), 0%, 0%, 0.5)',
].forEach((testCase) => {
	assert.deepStrictEqual(
		color(parse(testCase)),
		{
			colorNotation: 'rgb',
			channels: [0.2, 0, 0],
			alpha: 0.5,
			syntaxFlags: new Set(['legacy-rgb', 'has-alpha', 'has-percentage-values']),
		},
	);
});

[
	'rgb(20% 0 0 / 0.5)',
	'rgb(calc(10% * 2) 0 0 / 50%)',
	'rgb(calc(10% * 2)/**/0/**/ /**/0 / 50%)',
].forEach((testCase) => {
	assert.deepStrictEqual(
		color(parse(testCase)),
		{
			colorNotation: 'rgb',
			channels: [0.2, 0, 0],
			alpha: 0.5,
			syntaxFlags: new Set(['has-number-values', 'has-percentage-values', 'has-alpha']),
		},
	);
});

assert.deepStrictEqual(
	serialize_sRGB_data(color(parse('rgb(20%, 40%, 60%, 80%)'))),
	'rgba(51, 102, 153, 0.8)',
);

assert.deepStrictEqual(
	serialize_sRGB_data(color(parse('rgb(51, 102, 153, 0.8)'))),
	'rgba(51, 102, 153, 0.8)',
);

assert.deepStrictEqual(
	serialize_sRGB_data(color(parse('color(srgb 0 0 0)'))),
	'rgb(0, 0, 0)',
);

assert.deepStrictEqual(
	serialize_sRGB_data(color(parse('color(srgb 1 1 1)'))),
	'rgb(255, 255, 255)',
);

assert.deepStrictEqual(
	serialize_sRGB_data(color(parse('rgb(255 255 calc(0 / 0))'))),
	'',
);

assert.deepStrictEqual(
	serialize_sRGB_data(color(parse('rgb(255 255 calc(1 / 0))'))),
	'',
);

assert.deepStrictEqual(
	serialize_sRGB_data(color(parse('rgb(255 255 calc(0 / 1))'))),
	'rgb(255, 255, 0)',
);

assert.deepStrictEqual(
	serialize_sRGB_data(color(parse('rgb(255, 255, sin(90deg))'))),
	'rgb(255, 255, 1)',
);

assert.deepStrictEqual(
	serialize_sRGB_data(color(parse('rgb(255 255 sin(90deg))'))),
	'rgb(255, 255, 1)',
);

assert.deepStrictEqual(
	serialize_sRGB_data(color(parse('hsl(sin(90deg), 100%, 50%)'))),
	'rgb(255, 4, 0)',
);

assert.deepStrictEqual(
	serialize_sRGB_data(color(parse('hsl(sin(90deg) 100% 50%)'))),
	'rgb(255, 4, 0)',
);

assert.deepStrictEqual(
	serialize_sRGB_data(color(parse('color-mix(in srgb, red min(10%, 20%), blue)'))),
	'rgb(26, 0, 230)',
);
