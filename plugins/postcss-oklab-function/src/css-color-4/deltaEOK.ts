/**
 * @license W3C
 * https://www.w3.org/Consortium/Legal/2015/copyright-software-and-document
 *
 * @copyright This software or document includes material copied from or derived from https://github.com/w3c/csswg-drafts/blob/main/css-color-4/deltaEOK.js. Copyright © 2022 W3C® (MIT, ERCIM, Keio, Beihang).
 *
 * @see https://github.com/w3c/csswg-drafts/blob/main/css-color-4/deltaEOK.js
 */

// Calculate deltaE OK
// simple root sum of squares
type color = [number, number, number];
export function deltaEOK(reference: color, sample: color): number {
	// Given reference and sample are both in OKLab
	const [L1, a1, b1] = reference;
	const [L2, a2, b2] = sample;
	const ΔL = L1 - L2;
	const Δa = a1 - a2;
	const Δb = b1 - b2;
	return Math.sqrt(ΔL ** 2 + Δa ** 2 + Δb ** 2);
}
