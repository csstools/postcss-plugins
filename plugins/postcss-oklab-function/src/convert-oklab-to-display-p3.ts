import { gam_P3, lin_P3, lin_P3_to_XYZ, OKLab_to_OKLCH, OKLab_to_XYZ, OKLCH_to_OKLab, XYZ_to_lin_P3, XYZ_to_OKLab } from './css-color-4/conversions.js';
import { clip, inGamut, mapGamut } from './css-color-4/map-gamut';

type color = [number, number, number];

export function oklabToDisplayP3(oklabRaw: color): [color, boolean] {
	const [oklabLRaw, oklabARaw, oklabBRaw] = oklabRaw;

	const oklabL = Math.max(
		oklabLRaw,
		0,
	);

	const oklab = [oklabL / 100, oklabARaw, oklabBRaw] as color;

	let conversion = oklab.slice() as color;
	if (conversion[0] < 0.00001) { // very close to 0
		// A and B components are powerless when L is 0 or very close to 0
		conversion[1] = 0;
		conversion[2] = 0;
	}

	conversion = OKLab_to_XYZ(conversion);
	conversion = XYZ_to_lin_P3(conversion);
	conversion = gam_P3(conversion);

	if (inGamut(conversion)) {
		return [clip(conversion), true];
	}

	return [mapGamut(oklab, (x: color) => {
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
