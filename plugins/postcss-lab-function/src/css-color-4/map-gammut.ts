import { deltaEOK } from './deltaEOK';

// https://drafts.csswg.org/css-color-4/#binsearch
export function mapGammut(origin_OKLCH, inGamut, toDestination) {
	// 1. let origin_OKLCH be origin converted to the OKLCH color space
	// 2. let inGamut(color) be a function which returns true if, when passed a color, that color is inside the gamut of destination

	// 3. if inGamut(origin_OKLCH) is true, convert origin_OKLCH to destination and return it as the gamut mapped color
	if (inGamut(origin_OKLCH)) {
		return toDestination(origin_OKLCH);
	}

	// 4. otherwise, let delta(one, two) be a function which returns the deltaEOK of color one compared to color two
	// 5. let JND be 0.02
	const jnd = 0.02;
	// 6. let clip(color) | be a function which converts color to destination, converts all negative components to zero, converts all components greater that one to one, and returns the result
	const clip = (color) => {
		return toDestination(color).map(val => {
			if (val < 0) {
				return 0;
			} else if (val > 1) {
				return 1;
			} else {
				return val;
			}
		});
	};

	// 7. set min to zero
	let min = 0;
	// 8. set max to the OKLCH chroma of origin_OKLCH
	let max = origin_OKLCH[1];
	// 9. repeat the following steps
	while (max > 0.01) {
		// 9.1. set chroma to(min + max) / 2
		const chroma = (min + max) / 2;
		// 9.2. set current to origin_OKLCH and then set the chroma component to chroma
		const current = origin_OKLCH.slice();
		current[1] = chroma;
		// 9.3. if inGamut(current) is true, set min to chroma and continue to repeat these steps
		if (inGamut(current)) {
			min = chroma;
			continue;
		}

		// 9.4. otherwise, if inGamut(current) is false carry out these steps:
		// 9.4.1. set clipped to clip(current)
		const clipped = clip(current);
		// 9.4.2. set E to delta(clipped, current)
		const e = deltaEOK(clipped, current);
		// 9.4.3. if E < JND convert clipped to destination and return it as the gamut mapped color
		if (e < jnd) {
			return toDestination(clipped);
		}
		// 9.4.4. otherwise, set max to chroma and continue to repeat these steps
		max = chroma;
	}

	throw new Error('Could not map gamut');
}
