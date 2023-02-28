import { color } from '@csstools/css-color-parser';
import assert from 'assert';
import { parse } from '../util/parse.mjs';
import { serialize_sRGB_data } from '../util/serialize.mjs';

const tests = [
	// TODO : implement `none`
	// ['rgb(none none none)', 'rgb(0, 0, 0)'],
	// ['rgb(none none none / none)', 'rgba(0, 0, 0, 0)'],
	// ['rgb(128 none none)', 'rgb(128, 0, 0)'],
	// ['rgb(128 none none / none)', 'rgba(128, 0, 0, 0)'],
	// ['rgb(none none none / .5)', 'rgba(0, 0, 0, 0.5)'],
	// ['rgb(20% none none)', 'rgb(51, 0, 0)'],
	// ['rgb(20% none none / none)', 'rgba(51, 0, 0, 0)'],
	// ['rgb(none none none / 50%)', 'rgba(0, 0, 0, 0.5)'],
	// ['rgba(none none none)', 'rgb(0, 0, 0)'],
	// ['rgba(none none none / none)', 'rgba(0, 0, 0, 0)'],
	// ['rgba(128 none none)', 'rgb(128, 0, 0)'],
	// ['rgba(128 none none / none)', 'rgba(128, 0, 0, 0)'],
	// ['rgba(none none none / .5)', 'rgba(0, 0, 0, 0.5)'],
	// ['rgba(20% none none)', 'rgb(51, 0, 0)'],
	// ['rgba(20% none none / none)', 'rgba(51, 0, 0, 0)'],
	// ['rgba(none none none / 50%)', 'rgba(0, 0, 0, 0.5)'],

	['rgb(2.5, 3.4, 4.6)', 'rgb(3, 3, 5)', 'Tests that RGB channels are rounded appropriately'],

	['rgb(00, 51, 102)', 'rgb(0, 51, 102)', 'Valid numbers should be parsed'],
	['r\\gb(00, 51, 102)', 'rgb(0, 51, 102)', 'Correct escape sequences should still parse'],
	['r\\67 b(00, 51, 102)', 'rgb(0, 51, 102)', 'Correct escape sequences should still parse'],
	['RGB(153, 204, 255)', 'rgb(153, 204, 255)', 'Capitalization should not affect parsing'],
	['rgB(0, 0, 0)', 'rgb(0, 0, 0)', 'Capitalization should not affect parsing'],
	['rgB(0, 51, 255)', 'rgb(0, 51, 255)', 'Capitalization should not affect parsing'],
	['rgb(0,51,255)', 'rgb(0, 51, 255)', 'Lack of whitespace should not affect parsing'],
	['rgb(0\t,  51 ,255)', 'rgb(0, 51, 255)', 'Whitespace should not affect parsing'],
	['rgb(/* R */0, /* G */51, /* B */255)', 'rgb(0, 51, 255)', 'Comments should be allowed within function'],
	['rgb(50%, 50%, 50%)', 'rgb(128, 128, 128)', 'Valid percentages should be parsed'],
	['rgb(42%, 3%, 50%)', 'rgb(107, 8, 128)', 'Valid percentages should be parsed'],
	['RGB(100%, 100%, 100%)', 'rgb(255, 255, 255)', 'Capitalization should not affect parsing'],
	['rgB(0%, 0%, 0%)', 'rgb(0, 0, 0)', 'Capitalization should not affect parsing'],
	['rgB(10%, 20%, 30%)', 'rgb(26, 51, 77)', 'Capitalization should not affect parsing'],
	['rgb(10%,20%,30%)', 'rgb(26, 51, 77)', 'Whitespace should not affect parsing'],
	['rgb(10%\t,  20% ,30%)', 'rgb(26, 51, 77)', 'Whitespace should not affect parsing'],
	['rgb(/* R */ 10%, /* G */ 20%, /* B */ 30%)', 'rgb(26, 51, 77)', 'Comments should not affect parsing'],
	['rgb(-12%, 110%, 1400%)', 'rgb(0, 255, 255)', 'Invalid values should be clamped to 0 and 255 respectively'],
	['rgb(0, 0, 0, 0)', 'rgba(0, 0, 0, 0)', 'RGB and RGBA are synonyms'],
	['rgb(0%, 0%, 0%, 0%)', 'rgba(0, 0, 0, 0)', 'RGB and RGBA are synonyms'],
	['rgb(0%, 0%, 0%, 0)', 'rgba(0, 0, 0, 0)', 'RGB and RGBA are synonyms'],
	['rgba(0, 0, 0, 0)', 'rgba(0, 0, 0, 0)', 'Valid numbers should be parsed'],
	['rgba(204, 0, 102, 0.3)', 'rgba(204, 0, 102, 0.3)', 'Valid numbers should be parsed'],
	['RGBA(255, 255, 255, 0)', 'rgba(255, 255, 255, 0)', 'Capitalization should not affect parsing'],
	['rgBA(0, 51, 255, 1)', 'rgb(0, 51, 255)', 'Capitalization should not affect parsing'],
	['rgba(0, 51, 255, 1.1)', 'rgb(0, 51, 255)', 'Invalid alpha values should be clamped to 0 and 1 respectively'],
	['rgba(0, 51, 255, 37)', 'rgb(0, 51, 255)', 'Invalid alpha values should be clamped to 0 and 1 respectively'],
	['rgba(0, 51, 255, 0.42)', 'rgba(0, 51, 255, 0.42)', 'Valid numbers should be parsed'],
	['rgba(0, 51, 255, 0)', 'rgba(0, 51, 255, 0)', 'Valid numbers should be parsed'],
	['rgba(0, 51, 255, -0.1)', 'rgba(0, 51, 255, 0)', 'Invalid alpha values should be clamped to 0 and 1 respectively'],
	['rgba(0, 51, 255, -139)', 'rgba(0, 51, 255, 0)', 'Invalid alpha values should be clamped to 0 and 1 respectively'],
	['RGBA(100%, 100%, 100%, 0)', 'rgba(255, 255, 255, 0)', 'Capitalization should not affect parsing'],
	['rgba(42%, 3%, 50%, 0.3)', 'rgba(107, 8, 128, 0.3)', 'Valid percentages should be parsed'],
	['rgBA(0%, 20%, 100%, 1)', 'rgb(0, 51, 255)', 'Capitalization should not affect parsing'],
	['rgba(0%, 20%, 100%, 1.1)', 'rgb(0, 51, 255)', 'Invalid alpha values should be clamped to 0 and 1 respectively'],
	['rgba(0%, 20%, 100%, 37)', 'rgb(0, 51, 255)', 'Invalid alpha values should be clamped to 0 and 1 respectively'],
	['rgba(0%, 20%, 100%, 0.42)', 'rgba(0, 51, 255, 0.42)', 'Valid percentages should be parsed'],
	['rgba(0%, 20%, 100%, 0)', 'rgba(0, 51, 255, 0)', 'Valid percentages should be parsed'],
	['rgba(0%, 20%, 100%, -0.1)', 'rgba(0, 51, 255, 0)', 'Invalid alpha values should be clamped to 0 and 1 respectively'],
	['rgba(0%, 20%, 100%, -139)', 'rgba(0, 51, 255, 0)', 'Invalid alpha values should be clamped to 0 and 1 respectively'],
	['rgba(255, 255, 255, 0%)', 'rgba(255, 255, 255, 0)', 'Percent alpha values are accepted in rgb/rgba'],
	['rgba(0%, 0%, 0%, 0%)', 'rgba(0, 0, 0, 0)', 'Percent alpha values are accepted in rgb/rgba'],
	['rgba(0%, 0%, 0%)', 'rgb(0, 0, 0)', 'RGB and RGBA are synonyms'],
	['rgba(0, 0, 0)', 'rgb(0, 0, 0)', 'RGB and RGBA are synonyms'],
];

for (const test of tests) {
	assert.deepStrictEqual(
		serialize_sRGB_data(color(parse(test[0]))),
		test[1],
	);
}
