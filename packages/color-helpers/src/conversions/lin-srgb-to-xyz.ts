import { multiplyMatrices } from 'calculations/multiply-matrices';

/**
 * Convert an array of linear-light sRGB values to CIE XYZ
 * using sRGB's own white, D65 (no chromatic adaptation)
 *
 * @license W3C https://www.w3.org/Consortium/Legal/2015/copyright-software-and-document
 *
 * @copyright This software or document includes material copied from or derived from https://github.com/w3c/csswg-drafts/blob/main/css-color-4/conversions.js. Copyright © 2022 W3C® (MIT, ERCIM, Keio, Beihang).
 */
export function lin_sRGB_to_XYZ(rgb: Color): Color {
	const M = [
		[0.41239079926595934, 0.357584339383878, 0.1804807884018343],
		[0.21263900587151027, 0.715168678767756, 0.07219231536073371],
		[0.01933081871559182, 0.11919477979462598, 0.9505321522496607],
	];
	return multiplyMatrices(M, rgb) as Color;
}
