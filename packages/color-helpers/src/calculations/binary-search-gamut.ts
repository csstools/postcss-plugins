import { clip } from 'utils/clip';
import { OKLCH_to_OKLab } from 'conversions/oklch-to-oklab';
import { deltaEOK } from 'calculations/delta-EOK';

/**
 * @license W3C https://www.w3.org/Consortium/Legal/2015/copyright-software-and-document
 *
 * @copyright This software or document includes material copied from or derived from https://github.com/w3c/csswg-drafts/blob/main/css-color-4/map-gamut.js. Copyright © 2022 W3C® (MIT, ERCIM, Keio, Beihang).
 */
export function binarySearchGamut(
	startOKLCH: Color,
	toDestination: (x: Color) => Color,
	fromDestination: (x: Color) => Color,
): Color {
	let min = 0;
	let max = startOKLCH[1];
	const current = startOKLCH;

	while (max - min > 0.0001) {
		const clipped = clip(toDestination(current));
		const deltaE = deltaEOK(OKLCH_to_OKLab(current), OKLCH_to_OKLab(fromDestination(clipped)));
		// are we inside the gamut (or very close to the boundary, outside)
		if (deltaE - 0.02 < 0.0001) {
			min = current[1];
		} else {
			max = current[1];
		}
		// binary search
		current[1] = (max + min) / 2;
	}

	return clip(toDestination([...current]));
}
