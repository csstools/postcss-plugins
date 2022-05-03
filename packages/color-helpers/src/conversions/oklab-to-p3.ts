import { OKLab_to_OKLCH } from 'conversions/oklab-to-oklch';
import { OKLab_to_XYZ } from 'conversions/oklab-to-xyz';
import { XYZ_to_lin_P3 } from 'conversions/xyz-to-lin-p3';
import { gam_P3 } from 'conversions/gam-p3';
import { inGamut } from 'utils/in-gamut';
import { clip } from 'utils/clip';
import { mapGamut } from 'calculations/map-gamut';
import { OKLCH_to_OKLab } from 'conversions/oklch-to-oklab';
import { lin_P3 } from 'conversions/lin-p3';
import { lin_P3_to_XYZ } from 'conversions/lin-p3-to-xyz';
import { XYZ_to_OKLab } from 'conversions/xyz-to-oklab';

export function OKLab_to_P3(oklabRaw: Color): [Color, boolean] {
	const [oklabLRaw, oklabARaw, oklabBRaw] = oklabRaw;

	const oklabL = Math.max(
		oklabLRaw,
		0,
	);

	const oklab = [oklabL, oklabARaw, oklabBRaw] as Color;

	let conversion = oklab as Color;
	let oklch = OKLab_to_OKLCH(conversion);
	if (oklch[0] < 0.000001) {
		oklch = [0, 0, 0] as Color;
	}

	if (oklch[0] > 0.999999) {
		oklch = [1, 0, 0] as Color;
	}

	conversion = OKLab_to_XYZ(conversion);
	conversion = XYZ_to_lin_P3(conversion);
	conversion = gam_P3(conversion);

	if (inGamut(conversion)) {
		return [clip(conversion), true];
	}

	return [mapGamut(oklch, (x: Color) => {
		x = OKLCH_to_OKLab(x);
		x = OKLab_to_XYZ(x);
		x = XYZ_to_lin_P3(x);
		return gam_P3(x);
	}, (x: Color) => {
		x = lin_P3(x);
		x = lin_P3_to_XYZ(x);
		x = XYZ_to_OKLab(x);
		return OKLab_to_OKLCH(x);
	}), false];
}
