import { gam_sRGB } from './conversions.js';

type color = [number, number, number];

export function sRgbLinearToSRgb(linearSRgb: color): color {
	return gam_sRGB(linearSRgb);
}
