import { gam_sRGB, lin_sRGB, lin_sRGB_to_XYZ, OKLab_to_OKLCH, OKLab_to_XYZ, OKLCH_to_OKLab, XYZ_to_lin_sRGB, XYZ_to_OKLab } from './css-color-4/conversions.js';
import { clip, inGamut, mapGamut } from './css-color-4/map-gamut';

type color = [number, number, number];

export function sRgbLinearToSRgb(linearSRgb: color): color {
	let conversion = linearSRgb.slice() as color;

	// https://www.w3.org/TR/css-color-4/#predefined-to-predefined
	// https://www.w3.org/TR/css-color-4/#predefined-to-lab-oklab
	conversion = lin_sRGB_to_XYZ(conversion);

	let oklch = conversion.slice() as color;
	oklch = XYZ_to_OKLab(oklch);
	oklch = OKLab_to_OKLCH(oklch);
	if (oklch[0] < 0.000001) {
		oklch = [0, 0, 0] as color;
	}

	if (oklch[0] > 0.999999) {
		oklch = [1, 0, 0] as color;
	}

	// 3. Convert from(D65 - adapted) CIE XYZ to linear RGB
	conversion = XYZ_to_lin_sRGB(conversion);
	// 4. Convert from linear - light RGB to RGB(do gamma encoding)
	conversion = gam_sRGB(conversion);

	if (inGamut(conversion)) {
		return clip(conversion);
	}

	return mapGamut(oklch, (x: color) => {
		x = OKLCH_to_OKLab(x);
		x = OKLab_to_XYZ(x);
		x = XYZ_to_lin_sRGB(x);
		return gam_sRGB(x);
	}, (x: color) => {
		x = lin_sRGB(x);
		x = lin_sRGB_to_XYZ(x);
		x = XYZ_to_OKLab(x);
		return OKLab_to_OKLCH(x);
	});
}
