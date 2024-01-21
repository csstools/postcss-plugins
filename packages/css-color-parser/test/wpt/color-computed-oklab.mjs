import { color } from '@csstools/css-color-parser';
import assert from 'assert';
import { parse } from '../util/parse.mjs';
import { serialize_P3_data, serialize_sRGB_data } from '../util/serialize.mjs';

const tests = [
	['oklab(40% 0.001236 0.0039)', 'rgb(73, 71, 69)', 'color(display-p3 0.28515 0.27983 0.27246)'],
	['oklab(40% 0.1236 0.0039 / 1)', 'rgb(121, 34, 67)', 'color(display-p3 0.43853 0.16014 0.26019)'],
	['oklab(40% 0.1236 0.0039 / .5)', 'rgba(121, 34, 67, 0.5)', 'color(display-p3 0.43853 0.16014 0.26019 / 0.5)'],
	['oklab(40% 0.1236 0.0039 / 100%)', 'rgb(121, 34, 67)', 'color(display-p3 0.43853 0.16014 0.26019)'],
	['oklab(40% 0.1236 0.0039 / 50%)', 'rgba(121, 34, 67, 0.5)', 'color(display-p3 0.43853 0.16014 0.26019 / 0.5)'],
	['oklab(60% 0.1 0)', 'rgb(177, 102, 126)', 'color(display-p3 0.65225 0.41303 0.4911)'],
	['oklab(40.101% 0.1147 0.0453)', 'rgb(125, 35, 41)', 'color(display-p3 0.45163 0.16556 0.17021)'],
	['oklab(59.686% 0.1009 0.1192)', 'rgb(198, 93, 7)', 'color(display-p3 0.72414 0.38678 0.14879)'],
	['oklab(65.125% -0.0320 0.1274)', 'rgb(157, 147, 24)', 'color(display-p3 0.6093 0.57658 0.20615)'],
	['oklab(66.016% -0.1084 0.1114)', 'rgb(104, 166, 57)', 'color(display-p3 0.46287 0.64491 0.28775)'],
	['oklab(72.322% -0.0465 -0.1150)', 'rgb(98, 172, 239)', 'color(display-p3 0.45207 0.66555 0.91656)'],

	['oklab(0 0 0)', 'rgb(0, 0, 0)', 'color(display-p3 0 0 0)'],
	['oklab(0 0 0 / 1)', 'rgb(0, 0, 0)', 'color(display-p3 0 0 0)'],
	['oklab(0 0 0 / 0.5)', 'rgba(0, 0, 0, 0.5)', 'color(display-p3 0 0 0 / 0.5)'],
	['oklab(0.2 0 0.1/0.5)', 'rgba(31, 20, 0, 0.5)', 'color(display-p3 0.11443 0.08142 0 / 0.5)'],
	['oklab(0.2 0 0.1/50%)', 'rgba(31, 20, 0, 0.5)', 'color(display-p3 0.11443 0.08142 0 / 0.5)'],
	['oklab(4 0 0.1/50%)', 'rgba(255, 255, 255, 0.5)', 'color(display-p3 1 1 1 / 0.5)'],
	['oklab(0.5 -0.4 0.4)', 'rgb(53, 117, 0)', 'color(display-p3 0.25974 0.45977 0)'],
	['oklab(0.5 -1 1)', 'rgb(55, 117, 0)', 'color(display-p3 0.25974 0.45977 0)'],
	['oklab(0 0 0 / -10%)', 'rgba(0, 0, 0, 0)', 'color(display-p3 0 0 0 / 0)'],
	['oklab(0 0 0 / 110%)', 'rgb(0, 0, 0)', 'color(display-p3 0 0 0)'],
	['oklab(0 0 0 / 300%)', 'rgb(0, 0, 0)', 'color(display-p3 0 0 0)'],
	['oklab(-0.4 0 0)', 'rgb(0, 0, 0)', 'color(display-p3 0 0 0)'],
	['oklab(0.5 -0.1 0)', 'rgb(0, 116, 101)', 'color(display-p3 0.1594 0.45196 0.39888)'],
	['oklab(0.5 0 -0.1)', 'rgb(77, 95, 156)', 'color(display-p3 0.31641 0.3713 0.59541)'],
	['oklab(calc(0.50 * 3) calc(0.5 - 1) calc(1.5) / calc(-0.5 + 1))', 'rgba(255, 255, 255, 0.5)', 'color(display-p3 1 1 1 / 0.5)'],
	['oklab(calc(0.50 / 3) calc(0.5 - 1) calc(1.5) / calc(-0.5 + 1))', 'rgba(17, 16, 0, 0.5)', 'color(display-p3 0.06561 0.06185 0 / 0.5)'],
	['oklab(calc(-0.50 * 3) calc(0.5 + 1) calc(-1.5) / calc(-0.5 * 2))', 'rgba(0, 0, 0, 0)', 'color(display-p3 0 0 0 / 0)'],

	['oklab(none none none / none)', 'rgba(0, 0, 0, 0)', 'color(display-p3 0 0 0 / 0)'],
	['oklab(none none none)', 'rgb(0, 0, 0)', 'color(display-p3 0 0 0)'],
	['oklab(0.2 none none / none)', 'rgba(22, 22, 22, 0)', 'color(display-p3 0.0861 0.0861 0.0861 / 0)'],
	['oklab(none none none / 0.5)', 'rgba(0, 0, 0, 0.5)', 'color(display-p3 0 0 0 / 0.5)'],
	['oklab(0 0 0 / none)', 'rgba(0, 0, 0, 0)', 'color(display-p3 0 0 0 / 0)'],
];

for (const test of tests) {
	assert.deepStrictEqual(
		serialize_sRGB_data(color(parse(test[0]))),
		test[1],
		`"${test[0]}" : ${test[1]}`,
	);

	assert.deepStrictEqual(
		serialize_P3_data(color(parse(test[0]))),
		test[2],
		`"${test[0]}" : ${test[2]}`,
	);
}
