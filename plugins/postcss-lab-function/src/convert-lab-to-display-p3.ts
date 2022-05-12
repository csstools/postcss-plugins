import { D50_to_D65, gam_P3, Lab_to_XYZ, lin_P3, lin_P3_to_XYZ, OKLab_to_OKLCH, OKLab_to_XYZ, OKLCH_to_OKLab, XYZ_to_lin_P3, XYZ_to_OKLab } from './css-color-4/conversions.js';
import { clip, inGamut, mapGamut } from './css-color-4/map-gamut';

type color = [number, number, number];

export function labToDisplayP3(labRaw: color): [color, boolean] {
	const [labLRaw, labARaw, labBRaw] = labRaw;

	const labL = Math.max(
		labLRaw,
		0,
	);

	const labA = Math.min(
		Math.max(
			labARaw,
			-160,
		),
		160,
	);

	const labB = Math.min(
		Math.max(
			labBRaw,
			-160,
		),
		160,
	);

	const lab = [labL, labA, labB];

	let conversion = lab as color;

	// https://drafts.csswg.org/css-color-4/#oklab-lab-to-predefined
	// 1. Convert Lab to(D50 - adapted) XYZ
	conversion = Lab_to_XYZ(conversion);

	let oklch = conversion.slice() as color;
	oklch = D50_to_D65(oklch);
	oklch = XYZ_to_OKLab(oklch);
	oklch = OKLab_to_OKLCH(oklch);
	if (oklch[0] < 0.000001) {
		oklch = [0, 0, 0] as color;
	}

	if (oklch[0] > 0.999999) {
		oklch = [1, 0, 0] as color;
	}

	// 2. If needed, convert from a D50 whitepoint(used by Lab) to the D65 whitepoint used in sRGB and most other RGB spaces, with the Bradford transform.prophoto - rgb' does not require this step.
	conversion = D50_to_D65(conversion);
	// 3. Convert from(D65 - adapted) CIE XYZ to linear P3
	conversion = XYZ_to_lin_P3(conversion);
	// 4. Convert from linear - light P3 to P3(do gamma encoding)
	conversion = gam_P3(conversion);

	if (inGamut(conversion)) {
		return [clip(conversion), true];
	}

	return [mapGamut(oklch, (x: color) => {
		x = OKLCH_to_OKLab(x);
		x = OKLab_to_XYZ(x);
		x = XYZ_to_lin_P3(x);
		return gam_P3(x);
	}, (x: color) => {
		x = lin_P3(x);
		x = lin_P3_to_XYZ(x);
		x = XYZ_to_OKLab(x);
		return OKLab_to_OKLCH(x);
	}), false];
}
