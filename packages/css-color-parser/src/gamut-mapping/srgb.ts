import { mapGamutRayTrace } from '@csstools/color-helpers';
import { clip, XYZ_D50_to_sRGB, OKLCH_to_OKLab, XYZ_to_lin_sRGB, XYZ_D50_to_OKLCH, XYZ_to_OKLab, OKLab_to_OKLCH, gam_sRGB, OKLab_to_XYZ, lin_sRGB_to_XYZ, inGamut, Color } from '@csstools/color-helpers';

export function XYZ_D50_to_sRGB_Gamut(color: Color): Color {
	const srgb = XYZ_D50_to_sRGB(color);
	if (inGamut(srgb)) {
		return clip(srgb);
	}

	let oklch: Color = color;
	oklch = XYZ_D50_to_OKLCH(oklch);
	if (oklch[0] < 0.000001) {
		oklch = [0, 0, 0];
	}

	if (oklch[0] > 0.999999) {
		oklch = [1, 0, 0];
	}

	return gam_sRGB(mapGamutRayTrace(oklch, oklch_to_lin_srgb, lin_srgb_to_oklch));
}

function oklch_to_lin_srgb(x: Color): Color {
	x = OKLCH_to_OKLab(x);
	x = OKLab_to_XYZ(x);
	return XYZ_to_lin_sRGB(x);
}

function lin_srgb_to_oklch(x: Color): Color {
	x = lin_sRGB_to_XYZ(x);
	x = XYZ_to_OKLab(x);
	return OKLab_to_OKLCH(x);
}
