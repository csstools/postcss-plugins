import { mapGamutRayTrace } from '@csstools/color-helpers';
import { clip, XYZ_D50_to_OKLCH, OKLCH_to_OKLab, XYZ_to_lin_P3, gam_P3, XYZ_to_OKLab, OKLab_to_OKLCH, lin_P3_to_XYZ, OKLab_to_XYZ, XYZ_D50_to_P3, inGamut, Color } from '@csstools/color-helpers';

export function XYZ_D50_to_P3_Gamut(color: Color): Color {
	const p3 = XYZ_D50_to_P3(color);
	if (inGamut(p3)) {
		return clip(p3);
	}

	let oklch: Color = color;
	oklch = XYZ_D50_to_OKLCH(oklch);
	if (oklch[0] < 0.000001) {
		oklch = [0, 0, 0];
	}

	if (oklch[0] > 0.999999) {
		oklch = [1, 0, 0];
	}

	return gam_P3(mapGamutRayTrace(oklch, oklch_to_lin_p3, lin_p3_to_oklch));
}

function oklch_to_lin_p3(x: Color): Color {
	x = OKLCH_to_OKLab(x);
	x = OKLab_to_XYZ(x);
	return XYZ_to_lin_P3(x);
}

function lin_p3_to_oklch(x: Color): Color {
	x = lin_P3_to_XYZ(x);
	x = XYZ_to_OKLab(x);
	return OKLab_to_OKLCH(x);
}
