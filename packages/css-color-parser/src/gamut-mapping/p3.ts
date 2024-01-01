import { clip, XYZ_D50_to_OKLCH, OKLCH_to_OKLab, XYZ_to_lin_P3, gam_P3, XYZ_to_OKLab, OKLab_to_OKLCH, lin_P3_to_XYZ, lin_P3, OKLab_to_XYZ, mapGamut, XYZ_D50_to_P3, inGamut, Color } from '@csstools/color-helpers';

export function XYZ_D50_to_P3_Gamut(color: Color): Color {
	const srgb = XYZ_D50_to_P3(color);
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
		x = XYZ_to_lin_P3(x);
		return gam_P3(x);
	}, (x: Color) => {
		x = lin_P3(x);
		x = lin_P3_to_XYZ(x);
		x = XYZ_to_OKLab(x);
		return OKLab_to_OKLCH(x);
	});
}
