import { gam_sRGB, lin_P3, lin_P3_to_XYZ, lin_sRGB, lin_sRGB_to_XYZ, OKLab_to_OKLCH, OKLab_to_XYZ, OKLCH_to_OKLab, XYZ_to_lin_sRGB, XYZ_to_OKLab } from './conversions.js';
import { clip, inGamut, mapGamut } from './map-gamut';

type color = [number, number, number];

export function displayP3ToSRgb(displayP3: color): color {
	let conversion = displayP3.slice() as color;

	// convert an array of gamma-corrected display-p3 values
	// in the 0.0 to 1.0 range
	// to linear-light display-p3, then to CIE XYZ,
	// then adapt from D65 to D50,
	// then convert XYZ to CIE Lab
	// and finally, convert to CIE LCH

	// return Lab_to_LCH(XYZ_to_Lab(D65_to_D50(lin_P3_to_XYZ(lin_P3(RGB)))));

	// https://drafts.csswg.org/css-color-4/#oklab-lab-to-predefined
	// 1. Convert Lab to(D50 - adapted) XYZ
	conversion = lin_P3(conversion);
	// conversion = D65_to_D50(conversion);
	conversion = lin_P3_to_XYZ(conversion);

	let oklch = conversion.slice() as color;
	// oklch = D50_to_D65(oklch);
	oklch = XYZ_to_OKLab(oklch);
	oklch = OKLab_to_OKLCH(oklch);

	// 2. If needed, convert from a D50 whitepoint(used by Lab) to the D65 whitepoint used in sRGB and most other RGB spaces, with the Bradford transform.prophoto - rgb' does not require this step.
	// 3. Convert from(D65 - adapted) CIE XYZ to linear RGB
	conversion = XYZ_to_lin_sRGB(conversion);
	// 4. Convert from linear - light RGB to RGB(do gamma encoding)
	conversion = gam_sRGB(conversion);

	if (inGamut(conversion)) {
		clip(conversion);
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
