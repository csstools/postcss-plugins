import { color } from '@csstools/css-color-parser';
import assert from 'node:assert';
import { parse } from '../util/parse.mjs';
import { serialize_sRGB_data } from '../util/serialize.mjs';

const tests = [
	['hwb(120 30% 50%)', 'rgb(77, 128, 77)'],
	['hwb(120 30% 50% / 0.5)', 'rgba(77, 128, 77, 0.5)'],
	['hwb(120 30% 50% / 50%)', 'rgba(77, 128, 77, 0.5)'],
	['hwb(none none none)', 'rgb(255, 0, 0)'],
	['hwb(0 0% 0%)', 'rgb(255, 0, 0)'],
	['hwb(none none none / none)', 'rgba(255, 0, 0, 0)'],
	['hwb(0 0% 0% / 0)', 'rgba(255, 0, 0, 0)'],
	['hwb(120 none none)', 'rgb(0, 255, 0)'],
	['hwb(120 0% 0%)', 'rgb(0, 255, 0)'],
	['hwb(120 80% none)', 'rgb(204, 255, 204)'],
	['hwb(120 80% 0%)', 'rgb(204, 255, 204)'],
	['hwb(120 none 50%)', 'rgb(0, 128, 0)'],
	['hwb(120 0% 50%)', 'rgb(0, 128, 0)'],
	['hwb(120 30% 50% / none)', 'rgba(77, 128, 77, 0)'],
	['hwb(120 30% 50% / 0)', 'rgba(77, 128, 77, 0)'],
	['hwb(120 30% 50% / 0%)', 'rgba(77, 128, 77, 0)'],
	['hwb(none 100% 50% / none)', 'rgba(170, 170, 170, 0)'],
	['hwb(0 100% 50% / 0)', 'rgba(170, 170, 170, 0)'],

	['hwb(0 50% 50%)', 'rgb(128, 128, 128)', 'HWB value should parse and round correctly'],
	['hwb(30 50% 50%)', 'rgb(128, 128, 128)', 'HWB value should parse and round correctly'],
	['hwb(60 50% 50%)', 'rgb(128, 128, 128)', 'HWB value should parse and round correctly'],
	['hwb(90 50% 50%)', 'rgb(128, 128, 128)', 'HWB value should parse and round correctly'],
	['hwb(120 50% 50%)', 'rgb(128, 128, 128)', 'HWB value should parse and round correctly'],
	['hwb(180 50% 50%)', 'rgb(128, 128, 128)', 'HWB value should parse and round correctly'],
	['hwb(210 50% 50%)', 'rgb(128, 128, 128)', 'HWB value should parse and round correctly'],
	['hwb(240 50% 50%)', 'rgb(128, 128, 128)', 'HWB value should parse and round correctly'],
	['hwb(270 50% 50%)', 'rgb(128, 128, 128)', 'HWB value should parse and round correctly'],
	['hwb(300 50% 50%)', 'rgb(128, 128, 128)', 'HWB value should parse and round correctly'],
	['hwb(330 50% 50%)', 'rgb(128, 128, 128)', 'HWB value should parse and round correctly'],
	['hwb(360 50% 50%)', 'rgb(128, 128, 128)', 'HWB value should parse and round correctly'],
	['hwb(90deg 50% 50%)', 'rgb(128, 128, 128)', 'HWB value should parse and round correctly'],
	['hwb(90 0% 50%)', 'rgb(64, 128, 0)', 'HWB value should parse and round correctly'],
	['hwb(90 12.5% 50%)', 'rgb(80, 128, 32)', 'HWB value should parse and round correctly'],
	['hwb(90 25% 50%)', 'rgb(96, 128, 64)', 'HWB value should parse and round correctly'],
	['hwb(90 37.5% 50%)', 'rgb(112, 128, 96)', 'HWB value should parse and round correctly'],
	['hwb(90 62.5% 50%)', 'rgb(142, 142, 142)', 'HWB value should parse and round correctly'],
	['hwb(90 75% 50%)', 'rgb(153, 153, 153)', 'HWB value should parse and round correctly'],
	['hwb(90 87.5% 50%)', 'rgb(162, 162, 162)', 'HWB value should parse and round correctly'],
	['hwb(90 100% 50%)', 'rgb(170, 170, 170)', 'HWB value should parse and round correctly'],
	['hwb(90 50% 0%)', 'rgb(191, 255, 128)', 'HWB value should parse and round correctly'],
	['hwb(90 50% 12.5%)', 'rgb(175, 223, 128)', 'HWB value should parse and round correctly'],
	['hwb(90 50% 25%)', 'rgb(159, 191, 128)', 'HWB value should parse and round correctly'],
	['hwb(90 50% 37.5%)', 'rgb(143, 159, 128)', 'HWB value should parse and round correctly'],
	['hwb(90 50% 62.5%)', 'rgb(113, 113, 113)', 'HWB value should parse and round correctly'],
	['hwb(90 50% 75%)', 'rgb(102, 102, 102)', 'HWB value should parse and round correctly'],
	['hwb(90 50% 87.5%)', 'rgb(93, 93, 93)', 'HWB value should parse and round correctly'],
	['hwb(90 50% 100%)', 'rgb(85, 85, 85)', 'HWB value should parse and round correctly'],
	['hwb(90 50% 50% / 0)', 'rgba(128, 128, 128, 0)', 'HWB value should parse and round correctly'],
	['hwb(90 50% 50% / 0.2)', 'rgba(128, 128, 128, 0.2)', 'HWB value should parse and round correctly'],
	['hwb(90 50% 50% / 1)', 'rgb(128, 128, 128)', 'HWB value should parse and round correctly'],
];

for (const test of tests) {
	assert.deepStrictEqual(
		serialize_sRGB_data(color(parse(test[0]))),
		test[1],
	);
}
