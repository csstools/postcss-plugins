import { Lab_to_XYZ } from 'conversions/lab-to-xyz';
import { D50_to_D65 } from 'conversions/d50-to-d65';
import { XYZ_to_OKLab } from 'conversions/xyz-to-oklab';
import { OKLab_to_OKLCH } from 'conversions/oklab-to-oklch';
import { XYZ_to_lin_sRGB } from 'conversions/xyz-to-lin-srgb';
import { gam_sRGB } from 'conversions/gam-srgb';
import { inGamut } from 'utils/in-gamut';
import { clip } from 'utils/clip';
import { mapGamut } from 'calculations/map-gamut';
import { OKLCH_to_OKLab } from 'conversions/oklch-to-oklab';
import { OKLab_to_XYZ } from 'conversions/oklab-to-xyz';
import { lin_sRGB } from 'conversions/lin-srgb';
import { lin_sRGB_to_XYZ } from 'conversions/lin-srgb-to-xyz';

export function Lab_to_sRGB(labRaw: Color): Color {
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

	let conversion = lab as Color;

	// https://drafts.csswg.org/css-color-4/#oklab-lab-to-predefined
	// 1. Convert Lab to(D50 - adapted) XYZ
	conversion = Lab_to_XYZ(conversion);

	let oklch = conversion.slice() as Color;
	oklch = D50_to_D65(oklch);
	oklch = XYZ_to_OKLab(oklch);
	oklch = OKLab_to_OKLCH(oklch);
	if (oklch[0] < 0.000001) {
		oklch = [0, 0, 0] as Color;
	}

	if (oklch[0] > 0.999999) {
		oklch = [1, 0, 0] as Color;
	}

	// 2. If needed, convert from a D50 whitepoint(used by Lab) to the D65 whitepoint used in sRGB and most other RGB spaces, with the Bradford transform.prophoto - rgb' does not require this step.
	conversion = D50_to_D65(conversion);
	// 3. Convert from(D65 - adapted) CIE XYZ to linear RGB
	conversion = XYZ_to_lin_sRGB(conversion);
	// 4. Convert from linear - light RGB to RGB(do gamma encoding)
	conversion = gam_sRGB(conversion);

	if (inGamut(conversion)) {
		return clip(conversion).map((x) => {
			return Math.round(x * 255);
		}) as Color;
	}

	return mapGamut(oklch, (x: Color) => {
		x = OKLCH_to_OKLab(x);
		x = OKLab_to_XYZ(x);
		x = XYZ_to_lin_sRGB(x);
		return gam_sRGB(x);
	}, (x: Color) => {
		x = lin_sRGB(x);
		x = lin_sRGB_to_XYZ(x);
		x = XYZ_to_OKLab(x);
		return OKLab_to_OKLCH(x);
	}).map((x) => {
		return Math.round(x * 255);
	}) as Color;
}
