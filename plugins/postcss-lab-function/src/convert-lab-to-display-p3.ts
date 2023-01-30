import { calculations, conversions, utils } from '@csstools/color-helpers';

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
	// 3. Convert from(D65 - adapted) CIE XYZ to linear P3
	conversion = conversions.XYZ_to_lin_P3(conversion);
	// 4. Convert from linear - light P3 to P3(do gamma encoding)
	conversion = conversions.gam_P3(conversion);

	if (utils.inGamut(conversion)) {
		return [utils.clip(conversion), true];
	}

	return [calculations.mapGamut(oklch, (x: color) => {
		x = conversions.OKLCH_to_OKLab(x);
		x = conversions.OKLab_to_XYZ(x);
		x = conversions.XYZ_to_lin_P3(x);
		return conversions.gam_P3(x);
	}, (x: color) => {
		x = conversions.lin_P3(x);
		x = conversions.lin_P3_to_XYZ(x);
		x = conversions.XYZ_to_OKLab(x);
		return conversions.OKLab_to_OKLCH(x);
	}), false];
}
