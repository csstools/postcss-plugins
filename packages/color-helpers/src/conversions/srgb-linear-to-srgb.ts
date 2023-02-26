import type { Color } from 'types/color';
import { OKLCH_to_OKLab } from 'conversions/oklch-to-oklab';
import { OKLab_to_OKLCH } from 'conversions/oklab-to-oklch';
import { OKLab_to_XYZ } from 'conversions/oklab-to-xyz';
import { XYZ_to_OKLab } from 'conversions/xyz-to-oklab';
import { XYZ_to_lin_sRGB } from 'conversions/xyz-to-lin-srgb';
import { clip } from 'utils/clip';
import { gam_sRGB } from 'conversions/gam-srgb';
import { inGamut } from 'utils/in-gamut';
import { lin_sRGB } from 'conversions/lin-srgb';
import { lin_sRGB_to_XYZ } from 'conversions/lin-srgb-to-xyz';
import { mapGamut } from 'calculations/map-gamut';

export function sRGB_linear_to_sRGB(linearSRgb: Color): Color {
	let conversion = linearSRgb.slice() as Color;

	// https://www.w3.org/TR/css-color-4/#predefined-to-predefined
	// https://www.w3.org/TR/css-color-4/#predefined-to-lab-oklab
	conversion = lin_sRGB_to_XYZ(conversion);

	let oklch = conversion.slice() as Color;
	oklch = XYZ_to_OKLab(oklch);
	oklch = OKLab_to_OKLCH(oklch);
	if (oklch[0] < 0.000001) {
		oklch = [0, 0, 0] as Color;
	}

	if (oklch[0] > 0.999999) {
		oklch = [1, 0, 0] as Color;
	}

	// 3. Convert from(D65 - adapted) CIE XYZ to linear RGB
	conversion = XYZ_to_lin_sRGB(conversion);
	// 4. Convert from linear - light RGB to RGB(do gamma encoding)
	conversion = gam_sRGB(conversion);

	if (inGamut(conversion)) {
		return clip(conversion);
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
