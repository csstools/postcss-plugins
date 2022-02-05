import { gam_P3, lin_P3, lin_P3_to_XYZ, OKLab_to_OKLCH, OKLab_to_XYZ, OKLCH_to_OKLab, XYZ_to_lin_P3, XYZ_to_OKLab } from './css-color-4/conversions.js';
import { clip, inGamut, mapGamut } from './css-color-4/map-gamut';

type color = [number, number, number];

export function oklchToDisplayP3(oklchRaw: color): color {
	const [lchLRaw, lchARaw, lchBRaw] = oklchRaw;

	const lchL = Math.min(
		Math.max(
			lchLRaw,
			0,
		),
		100,
	);

	const oklch = [lchL / 100, lchARaw, lchBRaw] as color;

	let conversion = oklch.slice() as color;

	conversion = OKLCH_to_OKLab(conversion);
	conversion = OKLab_to_XYZ(conversion);
	conversion = XYZ_to_lin_P3(conversion);
	conversion = gam_P3(conversion);

	if (inGamut(conversion)) {
		return clip(conversion);
	}

	return mapGamut(oklch, (x: color) => {
		x = OKLCH_to_OKLab(x);
		x = OKLab_to_XYZ(x);
		x = XYZ_to_lin_P3(x);
		return gam_P3(x);
	}, (x: color) => {
		x = lin_P3(x);
		x = lin_P3_to_XYZ(x);
		x = XYZ_to_OKLab(x);
		return OKLab_to_OKLCH(x);
	});
}
