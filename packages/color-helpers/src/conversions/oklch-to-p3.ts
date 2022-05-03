import { OKLCH_to_OKLab } from 'conversions/oklch-to-oklab';
import { OKLab_to_XYZ } from 'conversions/oklab-to-xyz';
import { XYZ_to_lin_P3 } from 'conversions/xyz-to-lin-p3';
import { gam_P3 } from 'conversions/gam-p3';
import { inGamut } from 'utils/in-gamut';
import { clip } from 'utils/clip';
import { mapGamut } from 'calculations/map-gamut';
import { lin_P3 } from 'conversions/lin-p3';
import { lin_P3_to_XYZ } from 'conversions/lin-p3-to-xyz';
import { XYZ_to_OKLab } from 'conversions/xyz-to-oklab';
import { OKLab_to_OKLCH } from 'conversions/oklab-to-oklch';

export function OKLCH_to_P3(oklchRaw: Color): [Color, boolean] {
	const [oklchLRaw, oklchCRaw, oklchHRaw] = oklchRaw;

	const oklchL = Math.max(
		oklchLRaw,
		0,
	);

	const oklch = [oklchL, oklchCRaw, oklchHRaw % 360] as Color;

	let conversion = oklch as Color;
	if (conversion[0] < 0.000001) {
		conversion = [0, 0, 0] as Color;
	}

	if (conversion[0] > 0.999999) {
		conversion = [1, 0, 0] as Color;
	}

	conversion = OKLCH_to_OKLab(conversion);
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
