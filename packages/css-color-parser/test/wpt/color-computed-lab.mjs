import { color } from '@csstools/css-color-parser';
import assert from 'assert';
import { parse } from '../util/parse.mjs';
import { serialize_sRGB_data, serialize_P3_data } from '../util/serialize.mjs';

const tests = [
	['lab(40% 56.6 39)', 'rgb(179, 35, 35)', 'color(display-p3 0.64331 0.19245 0.16771)'],
	['lab(40% 56.6 39 / 1)', 'rgb(179, 35, 35)', 'color(display-p3 0.64331 0.19245 0.16771)'],
	['lab(40% 56.6 39 / .5)', 'rgba(179, 35, 35, 0.5)', 'color(display-p3 0.64331 0.19245 0.16771 / 0.5)'],
	['lab(40% 56.6 39 / 100%)', 'rgb(179, 35, 35)', 'color(display-p3 0.64331 0.19245 0.16771)'],
	['lab(40% 56.6 39 / 50%)', 'rgba(179, 35, 35, 0.5)', 'color(display-p3 0.64331 0.19245 0.16771 / 0.5)'],
	['lab(60% 50 0)', 'rgb(222, 105, 147)', 'color(display-p3 0.81388 0.43646 0.57322)'],
	['lab(40% 35% 30%)', 'rgb(163, 57, 35)', 'color(display-p3 0.59266 0.25309 0.17075)'],

	['lab(0 0 0)', 'rgb(0, 0, 0)', 'color(display-p3 0 0 0)'],
	['lab(0 0 0 / 1)', 'rgb(0, 0, 0)', 'color(display-p3 0 0 0)'],
	['lab(0 0 0 / 0.5)', 'rgba(0, 0, 0, 0.5)', 'color(display-p3 0 0 0 / 0.5)'],
	['lab(20 0 10/0.5)', 'rgba(52, 48, 34, 0.5)', 'color(display-p3 0.20256 0.18882 0.13828 / 0.5)'],
	['lab(20 0 10/50%)', 'rgba(52, 48, 34, 0.5)', 'color(display-p3 0.20256 0.18882 0.13828 / 0.5)'],
	['lab(400 0 10/50%)', 'rgba(255, 255, 255, 0.5)', 'color(display-p3 1 1 1 / 0.5)'],
	['lab(50 -160 160)', 'rgb(0, 134, 16)', 'color(display-p3 0 0.53919 0)'],
	['lab(50 -200 200)', 'rgb(50, 128, 0)', 'color(display-p3 0.25694 0.50249 0)'],
	['lab(0 0 0 / -10%)', 'rgba(0, 0, 0, 0)', 'color(display-p3 0 0 0 / 0)'],
	['lab(0 0 0 / 110%)', 'rgb(0, 0, 0)', 'color(display-p3 0 0 0)'],
	['lab(0 0 0 / 300%)', 'rgb(0, 0, 0)', 'color(display-p3 0 0 0)'],
	['lab(-40 0 0)', 'rgb(0, 0, 0)', 'color(display-p3 0 0 0)'],
	['lab(50 -20 0)', 'rgb(77, 129, 118)', 'color(display-p3 0.34973 0.49949 0.46434)'],
	['lab(50 0 -20)', 'rgb(104, 120, 153)', 'color(display-p3 0.41876 0.46812 0.58845)'],
	['lab(calc(50 * 3) calc(0.5 - 1) calc(1.5) / calc(-0.5 + 1))', 'rgba(255, 255, 255, 0.5)', 'color(display-p3 1 1 1 / 0.5)'],
	['lab(calc(50 / 3) calc(0.5 - 1) calc(1.5) / calc(-0.5 + 1))', 'rgba(41, 41, 39, 0.5)', 'color(display-p3 0.16151 0.16211 0.15382 / 0.5)'],
	['lab(calc(-50 * 3) calc(0.5 + 1) calc(-1.5) / calc(-0.5 * 2))', 'rgba(0, 0, 0, 0)', 'color(display-p3 0 0 0 / 0)'],

	['lab(none none none / none)', 'rgba(0, 0, 0, 0)', 'color(display-p3 0 0 0 / 0)'],
	['lab(none none none)', 'rgb(0, 0, 0)', 'color(display-p3 0 0 0)'],
	['lab(20 none none / none)', 'rgba(48, 48, 48, 0)', 'color(display-p3 0.18938 0.18938 0.18938 / 0)'],
	['lab(none none none / 0.5)', 'rgba(0, 0, 0, 0.5)', 'color(display-p3 0 0 0 / 0.5)'],
	['lab(0 0 0 / none)', 'rgba(0, 0, 0, 0)', 'color(display-p3 0 0 0 / 0)'],
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
