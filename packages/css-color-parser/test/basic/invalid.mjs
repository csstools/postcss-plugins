import { color } from '@csstools/css-color-parser';
import assert from 'node:assert';
import { parse } from '../util/parse.mjs';

const testCases = [];

for (const legacyFunctionName of [ 'rgb', 'rgba', 'hsl', 'hsla' ]) {
	testCases.push(
		`${legacyFunctionName}( )`,
		`${legacyFunctionName}(255 )`,
		`${legacyFunctionName}(255, )`,
		`${legacyFunctionName}(255, 0 )`,
		`${legacyFunctionName}(255, 0, )`,
		`${legacyFunctionName}(255, 0, foo(0))`,
		`${legacyFunctionName}(255, 0, var(--foo))`,
		`${legacyFunctionName}(255, 0, 0, )`,
		`${legacyFunctionName}(255, 0, 0, 0, )`,
		`${legacyFunctionName}(255, 0, 0, 0, 0)`,
		`${legacyFunctionName}(255 0, 0, 0)`,
		`${legacyFunctionName}(0, 255 0, 0)`,
		`${legacyFunctionName}(0, 0, 255 0)`,
		`${legacyFunctionName}(255 0, 0, 0, 0)`,
		`${legacyFunctionName}(0, 255 0, 0, 0)`,
		`${legacyFunctionName}(0, 0, 255 0, 0)`,
		`${legacyFunctionName}(0, 0, 0, 255 0)`,

		`${legacyFunctionName}(0, 0, 10px)`,
		`${legacyFunctionName}(0, 0, (0))`,
		`${legacyFunctionName}(0, 0, foo(0))`,
		`${legacyFunctionName}(0, 0, foo)`,
		`${legacyFunctionName}(0, 0, #foo)`,
		`${legacyFunctionName}(0, 0, /* 0 */)`,

		`${legacyFunctionName}(10px, 0, 0)`,
		`${legacyFunctionName}((0), 0, 0)`,
		`${legacyFunctionName}(foo(0), 0, 0)`,
		`${legacyFunctionName}(foo, 0, 0)`,
		`${legacyFunctionName}(#foo, 0, 0)`,
		`${legacyFunctionName}(/* 0 */, 0, 0)`,

		`${legacyFunctionName}(0 0 0, 0.5)`,
	);
}

testCases.push('foo(0 0 0 / 0.5)');

testCases.forEach((testCase) => {
	assert.deepStrictEqual(
		color(parse(testCase)),
		false,
	);
});
