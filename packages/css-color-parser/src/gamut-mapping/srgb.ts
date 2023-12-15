import { clip, XYZ_D50_to_sRGB, OKLCH_to_OKLab, XYZ_to_lin_sRGB, XYZ_D50_to_OKLCH, XYZ_to_OKLab, OKLab_to_OKLCH, gam_sRGB, lin_sRGB, OKLab_to_XYZ, mapGamut, lin_sRGB_to_XYZ, inGamut, Color } from '@csstools/color-helpers';

export function XYZ_D50_to_sRGB_Gamut(color: Color): Color {
	const srgb = XYZ_D50_to_sRGB(color);
	if (inGamut(srgb)) {
		return clip(srgb);
	}

	let oklch = color.slice() as Color;
	oklch = XYZ_D50_to_OKLCH(oklch);
	if (oklch[0] < 0.000001) {
		oklch = [0, 0, 0] as Color;
	}

	if (oklch[0] > 0.999999) {
		oklch = [1, 0, 0] as Color;
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
	});
}
