import { gam_P3, lin_P3, lin_P3_to_XYZ, OKLab_to_OKLCH, OKLab_to_XYZ, OKLCH_to_OKLab, XYZ_to_lin_P3, XYZ_to_OKLab } from './css-color-4/conversions.js';
import { clip, inGamut, mapGamut } from './css-color-4/map-gamut';

type color = [number, number, number];

export function oklchToDisplayP3(oklchRaw: color): [color, boolean] {
	const [oklchLRaw, oklchCRaw, oklchHRaw] = oklchRaw;

	const oklchL = Math.max(
		oklchLRaw,
		0,
	);

	const oklch = [oklchL, oklchCRaw, oklchHRaw % 360] as color;

	let conversion = oklch as color;
	if (conversion[0] < 0.000001) {
		conversion = [0, 0, 0] as color;
	}

	if (conversion[0] > 0.999999) {
		conversion = [1, 0, 0] as color;
	}

	conversion = OKLCH_to_OKLab(conversion);
	conversion = OKLab_to_XYZ(conversion);
	conversion = XYZ_to_lin_P3(conversion);
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
