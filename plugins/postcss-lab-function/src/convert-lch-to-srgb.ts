import { calculations, conversions, utils } from '@csstools/color-helpers';

type color = [number, number, number];

export function lchToSRgb(lchRaw: color): color {
	const [lchLRaw, lchCRaw, lchHRaw] = lchRaw;

	const lchL = Math.max(
		lchLRaw,
		0,
	);

	const lch = [lchL, lchCRaw, lchHRaw % 360] as color;

	let conversion = lch;
	conversion = conversions.LCH_to_Lab(conversion);

	// https://www.w3.org/TR/css-color-4/#oklab-lab-to-predefined
	// 1. Convert Lab to(D50 - adapted) XYZ
	conversion = conversions.Lab_to_XYZ(conversion);

	let oklch = conversion.slice() as color;
	oklch = conversions.D50_to_D65(oklch);
	oklch = conversions.XYZ_to_OKLab(oklch);
	oklch = conversions.OKLab_to_OKLCH(oklch);
	if (oklch[0] < 0.000001) {
		oklch = [0, 0, 0] as color;
	}

	if (oklch[0] > 0.999999) {
		oklch = [1, 0, 0] as color;
	}

	// 2. If needed, convert from a D50 whitepoint(used by Lab) to the D65 whitepoint used in sRGB and most other RGB spaces, with the Bradford transform.prophoto - rgb' does not require this step.
	conversion = conversions.D50_to_D65(conversion);
	// 3. Convert from(D65 - adapted) CIE XYZ to linear RGB
	conversion = conversions.XYZ_to_lin_sRGB(conversion);
	// 4. Convert from linear - light RGB to RGB(do gamma encoding)
	conversion = conversions.gam_sRGB(conversion);

	if (utils.inGamut(conversion)) {
		return utils.clip(conversion).map((x) => {
			return Math.round(x * 255);
		}) as color;
	}

	return calculations.mapGamut(oklch, (x: color) => {
		x = conversions.OKLCH_to_OKLab(x);
		x = conversions.OKLab_to_XYZ(x);
		x = conversions.XYZ_to_lin_sRGB(x);
		return conversions.gam_sRGB(x);
	}, (x: color) => {
		x = conversions.lin_sRGB(x);
		x = conversions.lin_sRGB_to_XYZ(x);
		x = conversions.XYZ_to_OKLab(x);
		return conversions.OKLab_to_OKLCH(x);
	}).map((x) => {
		return Math.round(x * 255);
	}) as color;
}
