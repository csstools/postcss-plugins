import { clip } from '../utils/clip';
import { OKLCH_to_OKLab } from '../conversions/oklch-to-oklab';
import { deltaEOK } from './delta-EOK';
import type { Color } from '../types/color';
import { inGamut } from '../utils/in-gamut';

const JND = 0.02;
const EPSILON = 0.00001;

export function binarySearchGamut(
	startOKLCH: Color,
	toDestination: (x: Color) => Color,
	fromDestination: (x: Color) => Color,
): Color {

	const current = startOKLCH;

	let min = 0.0;
	let max = current[1];

	while ((max - min) > EPSILON) {
		const chroma = (min + max) / 2.0;
		current[1] = chroma;

		const converted = toDestination(current);
		if (inGamut(converted)) {
			min = chroma;
			continue;
		}

		const clipped = clip(converted);
		const delta_e = deltaEOK(OKLCH_to_OKLab(fromDestination(clipped)), OKLCH_to_OKLab(current));
		if (delta_e < JND) {
			return clipped;
		}

		max = chroma;
	}

	return clip(toDestination([...current]));
}
