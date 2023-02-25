import { conversions } from '@csstools/color-helpers';

export const to_LAB: Map<string, (x: [number, number, number]) => [number, number, number]> = new Map([
	[
		'lab',
		(x: [number, number, number]) => {
			return conversions.Lab_to_XYZ(x);
		},
	],
	[
		'lch',
		(x: [number, number, number]) => {
			let y = x;
			y = conversions.LCH_to_Lab(y);
			y = conversions.Lab_to_XYZ(y);
			return y;
		},
	],
	[
		'oklab',
		(x: [number, number, number]) => {
			let y = x;
			y = conversions.OKLab_to_XYZ(y);
			return y;
		},
	],
	[
		'oklch',
		(x: [number, number, number]) => {
			let y = x;
			y = conversions.OKLCH_to_OKLab(y);
			y = conversions.OKLab_to_XYZ(y);
			return y;
		},
	],
	[
		'rgb',
		(x: [number, number, number]) => {
			let y = x;
			y = conversions.lin_sRGB(y);
			y = conversions.lin_sRGB_to_XYZ(y);
			y = conversions.D65_to_D50(y);
			return y;
		},
	],
	[
		'hsl',
		(x: [number, number, number]) => {
			let y = x;
			y = conversions.HSL_to_sRGB(y);
			y = conversions.lin_sRGB(y);
			y = conversions.lin_sRGB_to_XYZ(y);
			y = conversions.D65_to_D50(y);
			return y;
		},
	],
	[
		'hwb',
		(x: [number, number, number]) => {
			let y = x;
			y = conversions.HWB_to_sRGB(y);
			y = conversions.lin_sRGB(y);
			y = conversions.lin_sRGB_to_XYZ(y);
			y = conversions.D65_to_D50(y);
			return y;
		},
	],
]);
