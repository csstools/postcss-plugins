import { gam_sRGB, lin_sRGB, lin_sRGB_to_XYZ, OKLab_to_OKLCH, OKLab_to_XYZ, OKLCH_to_OKLab, XYZ_to_lin_sRGB, XYZ_to_OKLab } from './css-color-4/conversions.js';
import { clip, inGamut, mapGamut } from './css-color-4/map-gamut';

type color = [number, number, number];

export function oklabToSRgb(oklabRaw: color): color {
	const [labLRaw, labARaw, labBRaw] = oklabRaw;

	const labL = Math.max(
		labLRaw,
		0,
	);

	const oklab = [labL / 100, labARaw, labBRaw] as color;

	let conversion = oklab.slice() as color;

	conversion = OKLab_to_XYZ(conversion);
	conversion = XYZ_to_lin_sRGB(conversion);
	conversion = gam_sRGB(conversion);

	if (inGamut(conversion)) {
		return clip(conversion).map((x) => {
			return Math.round(x * 255);
		}) as color;
	}

	return mapGamut(oklab, (x: color) => {
		x = OKLCH_to_OKLab(x);
		x = OKLab_to_XYZ(x);
		x = XYZ_to_lin_sRGB(x);
		return gam_sRGB(x);
	}, (x: color) => {
		x = lin_sRGB(x);
		x = lin_sRGB_to_XYZ(x);
		x = XYZ_to_OKLab(x);
		return OKLab_to_OKLCH(x);
	}).map((x) => {
		return Math.round(x * 255);
	}) as color;
}
