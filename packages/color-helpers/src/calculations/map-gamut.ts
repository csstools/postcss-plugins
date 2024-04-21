import { clip } from '../utils/clip';
import { OKLCH_to_OKLab } from '../conversions/oklch-to-oklab';
import { deltaEOK } from './delta-EOK';
import type { Color } from '../types/color';
import { inGamut } from '../utils/in-gamut';

const JND = 0.02;
const EPSILON = 0.0001;

export function mapGamut(
	startOKLCH: Color,
	toDestination: (x: Color) => Color,
	fromDestination: (x: Color) => Color,
): Color {

	// 11. set current to origin_Oklch
	const current = startOKLCH;

	// 12. set clipped to clip(current)
	let clipped = clip(toDestination(current));

	// 13. set E to delta(clipped, current)
	let E = deltaEOK(OKLCH_to_OKLab(fromDestination(clipped)), OKLCH_to_OKLab(current));

	// 14. if E < JND
	if (E < JND) {
		// 14.1. return clipped as the gamut mapped color
		return clipped;
	}

	// 15. set min to zero
	let min = 0.0;
	// 16. set max to the Oklch chroma of origin_Oklch
	let max = current[1];
	// 17. let min_inGamut be a boolean that represents when min is still in gamut, and set it to true
	let min_inGamut = true;

	// 18. while (max - min is greater than epsilon) repeat the following steps
	while ((max - min) > EPSILON) {
		// 18.1. set chroma to (min + max) / 2
		const chroma = (min + max) / 2.0;
		// 18.2. set the chroma component of current to chroma
		current[1] = chroma;
		// 18.3. if min_inGamut is true and also if inGamut(current) is true, set min to chroma and continue to repeat these steps
		if (min_inGamut && inGamut(toDestination(current))) {
			min = chroma;
			continue;
		}

		// 18.4. otherwise, if inGamut(current) is false carry out these steps:
		// 18.4.1. set clipped to clip(current)
		clipped = clip(toDestination(current));
		// 18.4.2. set E to delta(clipped, current)
		E = deltaEOK(OKLCH_to_OKLab(fromDestination(clipped)), OKLCH_to_OKLab(current));

		// 18.4.3. if E < JND
		if (E < JND) {
			// 18.4.3.1 if (JND - E < epsilon) return clipped as the gamut mapped color
			if ((JND - E) < EPSILON) {
				return clipped;
			}

			// 18.4.3.2 otherwise,
			// 18.4.3.2.1 set min_inGamut to false
			min_inGamut = false;
			// 18.4.3.2.2 set min to chroma
			min = chroma;
			continue;
		}

		// 18.4.4. otherwise, set max to chroma and continue to repeat these steps
		max = chroma;
	}

	// 19. return clipped as the gamut mapped color
	return clip(toDestination([...current]));
}
