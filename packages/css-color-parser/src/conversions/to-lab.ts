import { conversions } from '@csstools/color-helpers';

export const to_LAB: Map<string, (x: [number, number, number]) => [number, number, number]> = new Map([
	[
		'lab',
		(x: [number, number, number]) => {
			return x;
		},
	],
	[
		'lch',
		(x: [number, number, number]) => {
			return conversions.LCH_to_Lab(x);
		},
	],
	[
		'oklab',
		(x: [number, number, number]) => {
			let y = x;
			y = conversions.OKLab_to_XYZ(y);
			y = conversions.XYZ_to_Lab(y);
			return y;
		},
	],
	[
		'oklch',
		(x: [number, number, number]) => {
			let y = x;
			y = conversions.OKLCH_to_OKLab(y);
			y = conversions.OKLab_to_XYZ(y);
			y = conversions.XYZ_to_Lab(y);
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
			y = conversions.XYZ_to_Lab(y);
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
			y = conversions.XYZ_to_Lab(y);
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
			y = conversions.XYZ_to_Lab(y);
			return y;
		},
	],
]);
