import { calculations, Color, conversions, utils, xyz } from '@csstools/color-helpers';

export function XYZ_D50_to_a98_Gamut(color: Color): Color {
	const srgb = xyz.XYZ_D50_to_a98_RGB(color);
	if (utils.inGamut(srgb)) {
		return utils.clip(srgb);
	}

	let oklch = color.slice() as Color;
	oklch = conversions.D50_to_D65(oklch);
	oklch = conversions.XYZ_to_OKLab(oklch);
	oklch = conversions.OKLab_to_OKLCH(oklch);
	if (oklch[0] < 0.000001) {
		oklch = [0, 0, 0] as Color;
	}

	if (oklch[0] > 0.999999) {
		oklch = [1, 0, 0] as Color;
	}

	return calculations.mapGamut(oklch, (x: Color) => {
		x = conversions.OKLCH_to_OKLab(x);
		x = conversions.OKLab_to_XYZ(x);
		x = conversions.XYZ_to_lin_a98rgb(x);
		return conversions.gam_a98rgb(x);
	}, (x: Color) => {
		x = conversions.lin_a98rgb(x);
		x = conversions.lin_a98rgb_to_XYZ(x);
		x = conversions.XYZ_to_OKLab(x);
		return conversions.OKLab_to_OKLCH(x);
	});
}
