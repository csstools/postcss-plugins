import { color } from '@csstools/css-color-parser';
import assert from 'node:assert';
import { canonicalize } from '../util/canonical.mjs';
import { parse } from '../util/parse.mjs';
import { serialize_sRGB_data } from '../util/serialize.mjs';

{
	for (const colorSpace of ['srgb', 'srgb-linear', 'a98-rgb', 'rec2020', 'prophoto-rgb', 'display-p3']) {
		const tests = [
			[`color(${colorSpace} 0% 0% 0%)`, canonicalize(`color(${colorSpace} 0 0 0)`)],
			[`color(${colorSpace} 10% 10% 10%)`, canonicalize(`color(${colorSpace} 0.1 0.1 0.1)`)],
			[`color(${colorSpace} .2 .2 25%)`, canonicalize(`color(${colorSpace} 0.2 0.2 0.25)`)],
			[`color(${colorSpace} 0 0 0 / 1)`, canonicalize(`color(${colorSpace} 0 0 0)`)],
			[`color(${colorSpace} 0% 0 0 / 0.5)`, canonicalize(`color(${colorSpace} 0 0 0 / 0.5)`)],
			[`color(${colorSpace} 20% 0 10/0.5)`, canonicalize(`color(${colorSpace} 0.2 0 10 / 0.5)`)],
			[`color(${colorSpace} 20% 0 10/50%)`, canonicalize(`color(${colorSpace} 0.2 0 10 / 0.5)`)],
			[`color(${colorSpace} 400% 0 10/50%)`, canonicalize(`color(${colorSpace} 4 0 10 / 0.5)`)],
			[`color(${colorSpace} 50% -160 160)`, canonicalize(`color(${colorSpace} 0.5 -160 160)`)],
			[`color(${colorSpace} 50% -200 200)`, canonicalize(`color(${colorSpace} 0.5 -200 200)`)],
			[`color(${colorSpace} 0 0 0 / -10%)`, canonicalize(`color(${colorSpace} 0 0 0 / 0)`)],
			[`color(${colorSpace} 0 0 0 / 110%)`, canonicalize(`color(${colorSpace} 0 0 0)`)],
			[`color(${colorSpace} 0 0 0 / 300%)`, canonicalize(`color(${colorSpace} 0 0 0)`)],
			[`color(${colorSpace} 200 200 200)`, canonicalize(`color(${colorSpace} 200 200 200)`)],
			[`color(${colorSpace} 200 200 200 / 200)`, canonicalize(`color(${colorSpace} 200 200 200)`)],
			[`color(${colorSpace} -200 -200 -200)`, canonicalize(`color(${colorSpace} -200 -200 -200)`)],
			[`color(${colorSpace} -200 -200 -200 / -200)`, canonicalize(`color(${colorSpace} -200 -200 -200 / 0)`)],
			[`color(${colorSpace} 200% 200% 200%)`, canonicalize(`color(${colorSpace} 2 2 2)`)],
			[`color(${colorSpace} 200% 200% 200% / 200%)`, canonicalize(`color(${colorSpace} 2 2 2)`)],
			[`color(${colorSpace} -200% -200% -200% / -200%)`, canonicalize(`color(${colorSpace} -2 -2 -2 / 0)`)],
			[`color(${colorSpace} calc(0.5 + 1) calc(0.5 - 1) calc(0.5) / calc(-0.5 + 1))`, canonicalize(`color(${colorSpace} 1.5 -0.5 0.5 / 0.5)`)],
			[`color(${colorSpace} calc(50% * 3) calc(-150% / 3) calc(50%) / calc(-50% * 3))`, canonicalize(`color(${colorSpace} 1.5 -0.5 0.5 / 0)`)],

			[`color(${colorSpace} none none none / none)`, canonicalize(`color(${colorSpace} none none none / none)`)],
			[`color(${colorSpace} none none none)`, canonicalize(`color(${colorSpace} none none none)`)],
			[`color(${colorSpace} 10% none none / none)`, canonicalize(`color(${colorSpace} 0.1 none none / none)`)],
			[`color(${colorSpace} none none none / 0.5)`, canonicalize(`color(${colorSpace} none none none / 0.5)`)],
			[`color(${colorSpace} 0 0 0 / none)`, canonicalize(`color(${colorSpace} 0 0 0 / none)`)],
		];

		for (const test of tests) {
			assert.deepStrictEqual(
				serialize_sRGB_data(color(parse(test[0]))),
				test[1],
				`"${test[0]}" : ${test[1]}`,
			);
		}
	}
}

{
	for (const colorSpace of ['xyz', 'xyz-d50', 'xyz-d65']) {
		const resultColorSpace = colorSpace == 'xyz' ? 'xyz-d65' : colorSpace;
		const tests = [
			[`color(${colorSpace} 0 0 0)`, canonicalize(`color(${resultColorSpace} 0 0 0)`)],
			[`color(${colorSpace} 0 0 0 / 1)`, canonicalize(`color(${resultColorSpace} 0 0 0)`)],
			[`color(${colorSpace} 1 1 1)`, canonicalize(`color(${resultColorSpace} 1 1 1)`)],
			[`color(${colorSpace} 1 1 1 / 1)`, canonicalize(`color(${resultColorSpace} 1 1 1)`)],
			[`color(${colorSpace} -1 -1 -1)`, canonicalize(`color(${resultColorSpace} -1 -1 -1)`)],
			[`color(${colorSpace} 0.1 0.1 0.1)`, canonicalize(`color(${resultColorSpace} 0.1 0.1 0.1)`)],
			[`color(${colorSpace} 10 10 10)`, canonicalize(`color(${resultColorSpace} 10 10 10)`)],
			[`color(${colorSpace} .2 .2 .25)`, canonicalize(`color(${resultColorSpace} 0.2 0.2 0.25)`)],
			[`color(${colorSpace} 0 0 0 / 0.5)`, canonicalize(`color(${resultColorSpace} 0 0 0 / 0.5)`)],
			[`color(${colorSpace} .20 0 10/0.5)`, canonicalize(`color(${resultColorSpace} 0.2 0 10 / 0.5)`)],
			[`color(${colorSpace} .20 0 10/50%)`, canonicalize(`color(${resultColorSpace} 0.2 0 10 / 0.5)`)],
			[`color(${colorSpace} 0 0 0 / -10%)`, canonicalize(`color(${resultColorSpace} 0 0 0 / 0)`)],
			[`color(${colorSpace} 0 0 0 / 110%)`, canonicalize(`color(${resultColorSpace} 0 0 0)`)],
			[`color(${colorSpace} 0 0 0 / 300%)`, canonicalize(`color(${resultColorSpace} 0 0 0)`)],
			[`color(${colorSpace} calc(0.5 + 1) calc(0.5 - 1) calc(0.5) / calc(-0.5 + 1))`, canonicalize(`color(${resultColorSpace} 1.5 -0.5 0.5 / 0.5)`)],

			[`color(${colorSpace} none none none / none)`, canonicalize(`color(${resultColorSpace} none none none / none)`)],
			[`color(${colorSpace} none none none)`, canonicalize(`color(${resultColorSpace} none none none)`)],
			[`color(${colorSpace} 0.2 none none / none)`, canonicalize(`color(${resultColorSpace} 0.2 none none / none)`)],
			[`color(${colorSpace} none none none / 0.5)`, canonicalize(`color(${resultColorSpace} none none none / 0.5)`)],
			[`color(${colorSpace} 0 0 0 / none)`, canonicalize(`color(${resultColorSpace} 0 0 0 / none)`)],
		];

		for (const test of tests) {
			assert.deepStrictEqual(
				serialize_sRGB_data(color(parse(test[0]))),
				test[1],
				`"${test[0]}" : ${test[1]}`,
			);
		}
	}
}

const tests = [
	// Opaque sRGB in color()
	['color(srgb 1.00 0.50 0.200)', canonicalize('color(srgb 1 0.5 0.2)'), '[sRGB all numbers]'],
	['color(srgb 100% 50% 20%)', canonicalize('color(srgb 1 0.5 0.2)'), '[sRGB all percent]'],
	['color(srgb 100% 0.5 20%)', canonicalize('color(srgb 1 0.5 0.2)'), '[sRGB mixed number and percent]'],
	['color(srgb 1.00 50% 0.2)', canonicalize('color(srgb 1 0.5 0.2)'), '[sRGB mixed number and percent 2]'],
	['color(srgb none none none)', canonicalize('color(srgb none none none)'), '[sRGB all none]'],
	['color(srgb 1.00 none 0.2)', canonicalize('color(srgb 1 none 0.2)'), '[sRGB number and none]'],
	['color(srgb 100% none 20%)', canonicalize('color(srgb 1 none 0.2)'), '[sRGB percent and none]'],
	['color(srgb 100% none 0.2)', canonicalize('color(srgb 1 none 0.2)'), '[sRGB number, percent and none]'],

	// non-unity alpha, sRGB in  color()
	['color(srgb 1.00 0.50 0.200 / 0.6)', canonicalize('color(srgb 1 0.5 0.2 / 0.6)'), '[sRGB with alpha, all numbers]'],
	['color(srgb 100% 50% 20% / 60%)', canonicalize('color(srgb 1 0.5 0.2 / 0.6)'), '[sRGB with alpha, all percent]'],
	['color(srgb 100% 0.5 20% / 0.6)', canonicalize('color(srgb 1 0.5 0.2 / 0.6)'), '[sRGB with alpha, mixed number and percent]'],
	['color(srgb 1.00 50% 0.2 / 60%)', canonicalize('color(srgb 1 0.5 0.2 / 0.6)'), '[sRGB with alpha, mixed number and percent 2]'],
	['color(srgb none none none / none)', canonicalize('color(srgb none none none / none)'), '[sRGB with alpha, all none]'],
	['color(srgb 1.00 none 0.2 / none)', canonicalize('color(srgb 1 none 0.2 / none)'), '[sRGB with alpha, number and none]'],
	['color(srgb 100% none 20% / 30%)', canonicalize('color(srgb 1 none 0.2 / 0.3)'), '[sRGB with alpha, percent and none]'],
	['color(srgb 100% none 0.2 / 23.7%)', canonicalize('color(srgb 1 none 0.2 / 0.237)'), '[sRGB with alpha, number, percent and none]'],

	// Opaque linear-light sRGB in color()
	['color(srgb-linear 1.00 0.50 0.200)', canonicalize('color(srgb-linear 1 0.5 0.2)'), '[Linear-light sRGB all numbers]'],
	['color(srgb-linear 100% 50% 20%)', canonicalize('color(srgb-linear 1 0.5 0.2)'), '[Linear-light sRGB all percent]'],
	['color(srgb-linear 100% 0.5 20%)', canonicalize('color(srgb-linear 1 0.5 0.2)'), '[Linear-light sRGB mixed number and percent]'],
	['color(srgb-linear 1.00 50% 0.2)', canonicalize('color(srgb-linear 1 0.5 0.2)'), '[Linear-light sRGB mixed number and percent 2]'],
	['color(srgb-linear none none none)', canonicalize('color(srgb-linear none none none)'), '[Linear-light sRGB all none]'],
	['color(srgb-linear 1.00 none 0.2)', canonicalize('color(srgb-linear 1 none 0.2)'), '[Linear-light sRGB number and none]'],
	['color(srgb-linear 100% none 20%)', canonicalize('color(srgb-linear 1 none 0.2)'), '[Linear-light sRGB percent and none]'],
	['color(srgb-linear 100% none 0.2)', canonicalize('color(srgb-linear 1 none 0.2)'), '[Linear-light sRGB number, percent and none]'],

	// non-unity alpha, linear-light sRGB in  color()
	['color(srgb-linear 1.00 0.50 0.200 / 0.6)', canonicalize('color(srgb-linear 1 0.5 0.2 / 0.6)'), '[Linear-light sRGB with alpha, all numbers]'],
	['color(srgb-linear 100% 50% 20% / 60%)', canonicalize('color(srgb-linear 1 0.5 0.2 / 0.6)'), '[Linear-light sRGB with alpha, all percent]'],
	['color(srgb-linear 100% 0.5 20% / 0.6)', canonicalize('color(srgb-linear 1 0.5 0.2 / 0.6)'), '[Linear-light sRGB with alpha, mixed number and percent]'],
	['color(srgb-linear 1.00 50% 0.2 / 60%)', canonicalize('color(srgb-linear 1 0.5 0.2 / 0.6)'), '[Linear-light sRGB with alpha, mixed number and percent 2]'],
	['color(srgb-linear none none none / none)', canonicalize('color(srgb-linear none none none / none)'), '[Linear-light sRGB with alpha, all none]'],
	['color(srgb-linear 1.00 none 0.2 / none)', canonicalize('color(srgb-linear 1 none 0.2 / none)'), '[Linear-light sRGB with alpha, number and none]'],
	['color(srgb-linear 100% none 20% / 30%)', canonicalize('color(srgb-linear 1 none 0.2 / 0.3)'), '[Linear-light sRGB with alpha, percent and none]'],
	['color(srgb-linear 100% none 0.2 / 23.7%)', canonicalize('color(srgb-linear 1 none 0.2 / 0.237)'), '[Linear-light sRGB with alpha, number, percent and none]'],

	// Opaque Display P3 in color()
	['color(display-p3 1.00 0.50 0.200)', canonicalize('color(display-p3 1 0.5 0.2)'), '[Display P3 all numbers]'],
	['color(display-p3 100% 50% 20%)', canonicalize('color(display-p3 1 0.5 0.2)'), '[Display P3 all percent]'],
	['color(display-p3 100% 0.5 20%)', canonicalize('color(display-p3 1 0.5 0.2)'), '[Display P3 mixed number and percent]'],
	['color(display-p3 1.00 50% 0.2)', canonicalize('color(display-p3 1 0.5 0.2)'), '[Display P3 mixed number and percent 2]'],
	['color(display-p3 none none none)', canonicalize('color(display-p3 none none none)'), '[Display P3 all none]'],
	['color(display-p3 1.00 none 0.2)', canonicalize('color(display-p3 1 none 0.2)'), '[Display P3 number and none]'],
	['color(display-p3 100% none 20%)', canonicalize('color(display-p3 1 none 0.2)'), '[Display P3 percent and none]'],
	['color(display-p3 100% none 0.2)', canonicalize('color(display-p3 1 none 0.2)'), '[Display P3 number, percent and none]'],

	// non-unity alpha, Display P3 in  color()
	['color(display-p3 1.00 0.50 0.200 / 0.6)', canonicalize('color(display-p3 1 0.5 0.2 / 0.6)'), '[Display P3 with alpha, all numbers]'],
	['color(display-p3 100% 50% 20% / 60%)', canonicalize('color(display-p3 1 0.5 0.2 / 0.6)'), '[Display P3 with alpha, all percent]'],
	['color(display-p3 100% 0.5 20% / 0.6)', canonicalize('color(display-p3 1 0.5 0.2 / 0.6)'), '[Display P3 with alpha, mixed number and percent]'],
	['color(display-p3 1.00 50% 0.2 / 60%)', canonicalize('color(display-p3 1 0.5 0.2 / 0.6)'), '[Display P3 with alpha, mixed number and percent 2]'],
	['color(display-p3 none none none / none)', canonicalize('color(display-p3 none none none / none)'), '[Display P3 with alpha, all none]'],
	['color(display-p3 1.00 none 0.2 / none)', canonicalize('color(display-p3 1 none 0.2 / none)'), '[Display P3 with alpha, number and none]'],
	['color(display-p3 100% none 20% / 30%)', canonicalize('color(display-p3 1 none 0.2 / 0.3)'), '[Display P3 with alpha, percent and none]'],
	['color(display-p3 100% none 0.2 / 23.7%)', canonicalize('color(display-p3 1 none 0.2 / 0.237)'), '[Display P3 with alpha, number, percent and none]'],

	// Opaque A98 RGB in color()
	['color(a98-rgb 1.00 0.50 0.200)', canonicalize('color(a98-rgb 1 0.5 0.2)'), '[A98 RGB all numbers]'],
	['color(a98-rgb 100% 50% 20%)', canonicalize('color(a98-rgb 1 0.5 0.2)'), '[A98 RGB all percent]'],
	['color(a98-rgb 100% 0.5 20%)', canonicalize('color(a98-rgb 1 0.5 0.2)'), '[A98 RGB mixed number and percent]'],
	['color(a98-rgb 1.00 50% 0.2)', canonicalize('color(a98-rgb 1 0.5 0.2)'), '[A98 RGB mixed number and percent 2]'],
	['color(a98-rgb none none none)', canonicalize('color(a98-rgb none none none)'), '[A98 RGB all none]'],
	['color(a98-rgb 1.00 none 0.2)', canonicalize('color(a98-rgb 1 none 0.2)'), '[A98 RGB number and none]'],
	['color(a98-rgb 100% none 20%)', canonicalize('color(a98-rgb 1 none 0.2)'), '[A98 RGB percent and none]'],
	['color(a98-rgb 100% none 0.2)', canonicalize('color(a98-rgb 1 none 0.2)'), '[A98 RGB number, percent and none]'],

	// non-unity alpha, A98 RGB in  color()
	['color(a98-rgb 1.00 0.50 0.200 / 0.6)', canonicalize('color(a98-rgb 1 0.5 0.2 / 0.6)'), '[A98 RGB with alpha, all numbers]'],
	['color(a98-rgb 100% 50% 20% / 60%)', canonicalize('color(a98-rgb 1 0.5 0.2 / 0.6)'), '[A98 RGB with alpha, all percent]'],
	['color(a98-rgb 100% 0.5 20% / 0.6)', canonicalize('color(a98-rgb 1 0.5 0.2 / 0.6)'), '[A98 RGB with alpha, mixed number and percent]'],
	['color(a98-rgb 1.00 50% 0.2 / 60%)', canonicalize('color(a98-rgb 1 0.5 0.2 / 0.6)'), '[A98 RGB with alpha, mixed number and percent 2]'],
	['color(a98-rgb none none none / none)', canonicalize('color(a98-rgb none none none / none)'), '[A98 RGB with alpha, all none]'],
	['color(a98-rgb 1.00 none 0.2 / none)', canonicalize('color(a98-rgb 1 none 0.2 / none)'), '[A98 RGB with alpha, number and none]'],
	['color(a98-rgb 100% none 20% / 30%)', canonicalize('color(a98-rgb 1 none 0.2 / 0.3)'), '[A98 RGB with alpha, percent and none]'],
	['color(a98-rgb 100% none 0.2 / 23.7%)', canonicalize('color(a98-rgb 1 none 0.2 / 0.237)'), '[A98 RGB with alpha, number, percent and none]'],

	// Opaque ProPhoto RGB in color()
	['color(prophoto-rgb 1.00 0.50 0.200)', canonicalize('color(prophoto-rgb 1 0.5 0.2)'), '[ProPhoto RGB all numbers]'],
	['color(prophoto-rgb 100% 50% 20%)', canonicalize('color(prophoto-rgb 1 0.5 0.2)'), '[ProPhoto RGB all percent]'],
	['color(prophoto-rgb 100% 0.5 20%)', canonicalize('color(prophoto-rgb 1 0.5 0.2)'), '[ProPhoto RGB mixed number and percent]'],
	['color(prophoto-rgb 1.00 50% 0.2)', canonicalize('color(prophoto-rgb 1 0.5 0.2)'), '[ProPhoto RGB mixed number and percent 2]'],
	['color(prophoto-rgb none none none)', canonicalize('color(prophoto-rgb none none none)'), '[ProPhoto RGB all none]'],
	['color(prophoto-rgb 1.00 none 0.2)', canonicalize('color(prophoto-rgb 1 none 0.2)'), '[ProPhoto RGB number and none]'],
	['color(prophoto-rgb 100% none 20%)', canonicalize('color(prophoto-rgb 1 none 0.2)'), '[ProPhoto RGB percent and none]'],
	['color(prophoto-rgb 100% none 0.2)', canonicalize('color(prophoto-rgb 1 none 0.2)'), '[ProPhoto RGB number, percent and none]'],

	// non-unity alpha, ProPhoto RGB in  color()
	['color(prophoto-rgb 1.00 0.50 0.200 / 0.6)', canonicalize('color(prophoto-rgb 1 0.5 0.2 / 0.6)'), '[ProPhoto RGB with alpha, all numbers]'],
	['color(prophoto-rgb 100% 50% 20% / 60%)', canonicalize('color(prophoto-rgb 1 0.5 0.2 / 0.6)'), '[ProPhoto RGB with alpha, all percent]'],
	['color(prophoto-rgb 100% 0.5 20% / 0.6)', canonicalize('color(prophoto-rgb 1 0.5 0.2 / 0.6)'), '[ProPhoto RGB with alpha, mixed number and percent]'],
	['color(prophoto-rgb 1.00 50% 0.2 / 60%)', canonicalize('color(prophoto-rgb 1 0.5 0.2 / 0.6)'), '[ProPhoto RGB with alpha, mixed number and percent 2]'],
	['color(prophoto-rgb none none none / none)', canonicalize('color(prophoto-rgb none none none / none)'), '[ProPhoto RGB with alpha, all none]'],
	['color(prophoto-rgb 1.00 none 0.2 / none)', canonicalize('color(prophoto-rgb 1 none 0.2 / none)'), '[ProPhoto RGB with alpha, number and none]'],
	['color(prophoto-rgb 100% none 20% / 30%)', canonicalize('color(prophoto-rgb 1 none 0.2 / 0.3)'), '[ProPhoto RGB with alpha, percent and none]'],
	['color(prophoto-rgb 100% none 0.2 / 23.7%)', canonicalize('color(prophoto-rgb 1 none 0.2 / 0.237)'), '[ProPhoto RGB with alpha, number, percent and none]'],

	// Opaque Rec BT.2020 in  color()
	['color(rec2020 1.00 0.50 0.200)', canonicalize('color(rec2020 1 0.5 0.2)'), '[Rec BT.2020 all numbers]'],
	['color(rec2020 100% 50% 20%)', canonicalize('color(rec2020 1 0.5 0.2)'), '[Rec BT.2020 all percent]'],
	['color(rec2020 100% 0.5 20%)', canonicalize('color(rec2020 1 0.5 0.2)'), '[Rec BT.2020 mixed number and percent]'],
	['color(rec2020 1.00 50% 0.2)', canonicalize('color(rec2020 1 0.5 0.2)'), '[Rec BT.2020 mixed number and percent 2]'],
	['color(rec2020 none none none)', canonicalize('color(rec2020 none none none)'), '[Rec BT.2020 all none]'],
	['color(rec2020 1.00 none 0.2)', canonicalize('color(rec2020 1 none 0.2)'), '[Rec BT.2020 number and none]'],
	['color(rec2020 100% none 20%)', canonicalize('color(rec2020 1 none 0.2)'), '[Rec BT.2020 percent and none]'],
	['color(rec2020 100% none 0.2)', canonicalize('color(rec2020 1 none 0.2)'), '[Rec BT.2020 number, percent and none]'],

	// non-unity alpha, Rec BT.2020 in  color()
	['color(rec2020 1.00 0.50 0.200 / 0.6)', canonicalize('color(rec2020 1 0.5 0.2 / 0.6)'), '[Rec BT.2020 with alpha, all numbers]'],
	['color(rec2020 100% 50% 20% / 60%)', canonicalize('color(rec2020 1 0.5 0.2 / 0.6)'), '[Rec BT.2020 with alpha, all percent]'],
	['color(rec2020 100% 0.5 20% / 0.6)', canonicalize('color(rec2020 1 0.5 0.2 / 0.6)'), '[Rec BT.2020 with alpha, mixed number and percent]'],
	['color(rec2020 1.00 50% 0.2 / 60%)', canonicalize('color(rec2020 1 0.5 0.2 / 0.6)'), '[Rec BT.2020 with alpha, mixed number and percent 2]'],
	['color(rec2020 none none none / none)', canonicalize('color(rec2020 none none none / none)'), '[Rec BT.2020 with alpha, all none]'],
	['color(rec2020 1.00 none 0.2 / none)', canonicalize('color(rec2020 1 none 0.2 / none)'), '[Rec BT.2020 with alpha, number and none]'],
	['color(rec2020 100% none 20% / 30%)', canonicalize('color(rec2020 1 none 0.2 / 0.3)'), '[Rec BT.2020 with alpha, percent and none]'],
	['color(rec2020 100% none 0.2 / 23.7%)', canonicalize('color(rec2020 1 none 0.2 / 0.237)'), '[Rec BT.2020 with alpha, number, percent and none]'],

	// Opaque CIE XYZ D50 in color()
	['color(xyz-d50 1.00 0.50 0.200)', canonicalize('color(xyz-d50 1 0.5 0.2)'), '[CIE XYZ D50 all numbers]'],
	['color(xyz-d50 100% 50% 20%)', canonicalize('color(xyz-d50 1 0.5 0.2)'), '[CIE XYZ D50 all percent]'],
	['color(xyz-d50 100% 0.5 20%)', canonicalize('color(xyz-d50 1 0.5 0.2)'), '[CIE XYZ D50 mixed number and percent]'],
	['color(xyz-d50 1.00 50% 0.2)', canonicalize('color(xyz-d50 1 0.5 0.2)'), '[CIE XYZ D50 mixed number and percent 2]'],
	['color(xyz-d50 none none none)', canonicalize('color(xyz-d50 none none none)'), '[CIE XYZ D50 all none]'],
	['color(xyz-d50 1.00 none 0.2)', canonicalize('color(xyz-d50 1 none 0.2)'), '[CIE XYZ D50 number and none]'],
	['color(xyz-d50 100% none 20%)', canonicalize('color(xyz-d50 1 none 0.2)'), '[CIE XYZ D50 percent and none]'],
	['color(xyz-d50 100% none 0.2)', canonicalize('color(xyz-d50 1 none 0.2)'), '[CIE XYZ D50 number, percent and none]'],

	// non-unity alpha, CIE XYZ D50 in  color()
	['color(xyz-d50 1.00 0.50 0.200 / 0.6)', canonicalize('color(xyz-d50 1 0.5 0.2 / 0.6)'), '[CIE XYZ D50 with alpha, all numbers]'],
	['color(xyz-d50 100% 50% 20% / 60%)', canonicalize('color(xyz-d50 1 0.5 0.2 / 0.6)'), '[CIE XYZ D50 with alpha, all percent]'],
	['color(xyz-d50 100% 0.5 20% / 0.6)', canonicalize('color(xyz-d50 1 0.5 0.2 / 0.6)'), '[CIE XYZ D50 with alpha, mixed number and percent]'],
	['color(xyz-d50 1.00 50% 0.2 / 60%)', canonicalize('color(xyz-d50 1 0.5 0.2 / 0.6)'), '[CIE XYZ D50 with alpha, mixed number and percent 2]'],
	['color(xyz-d50 none none none / none)', canonicalize('color(xyz-d50 none none none / none)'), '[CIE XYZ D50 with alpha, all none]'],
	['color(xyz-d50 1.00 none 0.2 / none)', canonicalize('color(xyz-d50 1 none 0.2 / none)'), '[CIE XYZ D50 with alpha, number and none]'],
	['color(xyz-d50 100% none 20% / 30%)', canonicalize('color(xyz-d50 1 none 0.2 / 0.3)'), '[CIE XYZ D50 with alpha, percent and none]'],
	['color(xyz-d50 100% none 0.2 / 23.7%)', canonicalize('color(xyz-d50 1 none 0.2 / 0.237)'), '[CIE XYZ D50 with alpha, number, percent and none]'],

	// Opaque CIE XYZ D65 in color()
	['color(xyz-d65 1.00 0.50 0.200)', canonicalize('color(xyz-d65 1 0.5 0.2)'), '[CIE XYZ D65 all numbers]'],
	['color(xyz-d65 100% 50% 20%)', canonicalize('color(xyz-d65 1 0.5 0.2)'), '[CIE XYZ D65 all percent]'],
	['color(xyz-d65 100% 0.5 20%)', canonicalize('color(xyz-d65 1 0.5 0.2)'), '[CIE XYZ D65 mixed number and percent]'],
	['color(xyz-d65 1.00 50% 0.2)', canonicalize('color(xyz-d65 1 0.5 0.2)'), '[CIE XYZ D65 mixed number and percent 2]'],
	['color(xyz-d65 none none none)', canonicalize('color(xyz-d65 none none none)'), '[CIE XYZ D65 all none]'],
	['color(xyz-d65 1.00 none 0.2)', canonicalize('color(xyz-d65 1 none 0.2)'), '[CIE XYZ D65 number and none]'],
	['color(xyz-d65 100% none 20%)', canonicalize('color(xyz-d65 1 none 0.2)'), '[CIE XYZ D65 percent and none]'],
	['color(xyz-d65 100% none 0.2)', canonicalize('color(xyz-d65 1 none 0.2)'), '[CIE XYZ D65 number, percent and none]'],

	// non-unity alpha, CIE XYZ D65 in  color()
	['color(xyz-d65 1.00 0.50 0.200 / 0.6)', canonicalize('color(xyz-d65 1 0.5 0.2 / 0.6)'), '[CIE XYZ D65 with alpha, all numbers]'],
	['color(xyz-d65 100% 50% 20% / 60%)', canonicalize('color(xyz-d65 1 0.5 0.2 / 0.6)'), '[CIE XYZ D65 with alpha, all percent]'],
	['color(xyz-d65 100% 0.5 20% / 0.6)', canonicalize('color(xyz-d65 1 0.5 0.2 / 0.6)'), '[CIE XYZ D65 with alpha, mixed number and percent]'],
	['color(xyz-d65 1.00 50% 0.2 / 60%)', canonicalize('color(xyz-d65 1 0.5 0.2 / 0.6)'), '[CIE XYZ D65 with alpha, mixed number and percent 2]'],
	['color(xyz-d65 none none none / none)', canonicalize('color(xyz-d65 none none none / none)'), '[CIE XYZ D65 with alpha, all none]'],
	['color(xyz-d65 1.00 none 0.2 / none)', canonicalize('color(xyz-d65 1 none 0.2 / none)'), '[CIE XYZ D65 with alpha, number and none]'],
	['color(xyz-d65 100% none 20% / 30%)', canonicalize('color(xyz-d65 1 none 0.2 / 0.3)'), '[CIE XYZ D65 with alpha, percent and none]'],
	['color(xyz-d65 100% none 0.2 / 23.7%)', canonicalize('color(xyz-d65 1 none 0.2 / 0.237)'), '[CIE XYZ D65 with alpha, number, percent and none]'],

	// Opaque CIE XYZ (implicit D65) in color()
	['color(xyz 1.00 0.50 0.200)', canonicalize('color(xyz-d65 1 0.5 0.2)'), '[CIE XYZ (implicit D65) all numbers]'],
	['color(xyz 100% 50% 20%)', canonicalize('color(xyz-d65 1 0.5 0.2)'), '[CIE XYZ (implicit D65) all percent]'],
	['color(xyz 100% 0.5 20%)', canonicalize('color(xyz-d65 1 0.5 0.2)'), '[CIE XYZ (implicit D65) mixed number and percent]'],
	['color(xyz 1.00 50% 0.2)', canonicalize('color(xyz-d65 1 0.5 0.2)'), '[CIE XYZ (implicit D65) mixed number and percent 2]'],
	['color(xyz none none none)', canonicalize('color(xyz-d65 none none none)'), '[CIE XYZ (implicit D65) all none]'],
	['color(xyz 1.00 none 0.2)', canonicalize('color(xyz-d65 1 none 0.2)'), '[CIE XYZ (implicit D65) number and none]'],
	['color(xyz 100% none 20%)', canonicalize('color(xyz-d65 1 none 0.2)'), '[CIE XYZ (implicit D65) percent and none]'],
	['color(xyz 100% none 0.2)', canonicalize('color(xyz-d65 1 none 0.2)'), '[CIE XYZ (implicit D65) number, percent and none]'],

	// non-unity alpha, CIE XYZ (implicit D65) in  color()
	['color(xyz 1.00 0.50 0.200 / 0.6)', canonicalize('color(xyz-d65 1 0.5 0.2 / 0.6)'), '[CIE XYZ (implicit D65) with alpha, all numbers]'],
	['color(xyz 100% 50% 20% / 60%)', canonicalize('color(xyz-d65 1 0.5 0.2 / 0.6)'), '[CIE XYZ (implicit D65) with alpha, all percent]'],
	['color(xyz 100% 0.5 20% / 0.6)', canonicalize('color(xyz-d65 1 0.5 0.2 / 0.6)'), '[CIE XYZ (implicit D65) with alpha, mixed number and percent]'],
	['color(xyz 1.00 50% 0.2 / 60%)', canonicalize('color(xyz-d65 1 0.5 0.2 / 0.6)'), '[CIE XYZ (implicit D65) with alpha, mixed number and percent 2]'],
	['color(xyz none none none / none)', canonicalize('color(xyz-d65 none none none / none)'), '[CIE XYZ (implicit D65) with alpha, all none]'],
	['color(xyz 1.00 none 0.2 / none)', canonicalize('color(xyz-d65 1 none 0.2 / none)'), '[CIE XYZ (implicit D65) with alpha, number and none]'],
	['color(xyz 100% none 20% / 30%)', canonicalize('color(xyz-d65 1 none 0.2 / 0.3)'), '[CIE XYZ (implicit D65) with alpha, percent and none]'],
	['color(xyz 100% none 0.2 / 23.7%)', canonicalize('color(xyz-d65 1 none 0.2 / 0.237)'), '[CIE XYZ (implicit D65) with alpha, number, percent and none]'],

	// Tests basic parsing of the color function
	['color(srgb 1 1 1)', canonicalize('color(srgb 1 1 1)'), '[Basic sRGB white]'],
	['color(    srgb         1      1 1       )', canonicalize('color(srgb 1 1 1)'), '[White with lots of space]'],
	['color(srgb 0.25 0.5 0.75)', canonicalize('color(srgb 0.25 0.5 0.75)'), '[sRGB color]'],
	['color(SrGb 0.25 0.5 0.75)', canonicalize('color(srgb 0.25 0.5 0.75)'), '[Different case for sRGB]'],
	['color(srgb 1.00000 0.500000 0.20)', canonicalize('color(srgb 1 0.5 0.2)'), '[sRGB color with unnecessary decimals]'],
	['color(srgb 1 1 1 / 0.5)', canonicalize('color(srgb 1 1 1 / 0.5)'), '[sRGB white with 0.5 alpha]'],
	['color(srgb 1 1 1 / 0)', canonicalize('color(srgb 1 1 1 / 0)'), '[sRGB white with 0 alpha]'],
	['color(srgb 1 1 1 / 50%)', canonicalize('color(srgb 1 1 1 / 0.5)'), '[sRGB white with 50% alpha]'],
	['color(srgb 1 1 1 / 0%)', canonicalize('color(srgb 1 1 1 / 0)'), '[sRGB white with 0% alpha]'],
	['color(display-p3 0.6 0.7 0.8)', canonicalize('color(display-p3 0.6 0.7 0.8)'), '[Display P3 color]'],
	['color(dIspLaY-P3 0.6 0.7 0.8)', canonicalize('color(display-p3 0.6 0.7 0.8)'), '[Different case for Display P3]'],

	['color(srgb -0.25 0.5 0.75)', canonicalize('color(srgb -0.25 0.5 0.75)'), '[sRGB color with negative component should not clamp to 0]'],
	['color(srgb 0.25 1.5 0.75)', canonicalize('color(srgb 0.25 1.5 0.75)'), '[sRGB color with component > 1 should not clamp]'],
	['color(display-p3 0.5 -199 0.75)', canonicalize('color(display-p3 0.5 -199 0.75)'), '[Display P3 color with negative component should not clamp to 0]'],
	['color(display-p3 184 1.00001 2347329746587)', canonicalize('color(display-p3 184 1.00001 2347329700000)'), '[Display P3 color with component > 1 should not clamp]'],
	['color(srgb 0.1 0.2 0.3 / 1.9)', canonicalize('color(srgb 0.1 0.2 0.3)'), '[Alpha > 1 should clamp]'],
	['color(srgb 1 1 1 / -0.2)', canonicalize('color(srgb 1 1 1 / 0)'), '[Negative alpha should clamp]'],
];

for (const test of tests) {
	assert.deepStrictEqual(
		serialize_sRGB_data(color(parse(test[0]))),
		test[1],
		`"${test[0]}" : ${test[1]} - ${test[2]}`,
	);
}
