import { OKLCH_to_OKLab } from './conversions';
import { deltaEOK } from './deltaEOK';

type color = [number, number, number];

export function mapGamut(startOKLCH: color, toDestination: (x: color) => color, fromDestination: (x: color) => color): color {
	return binarySearchGamut(startOKLCH, toDestination, fromDestination);
}

function binarySearchGamut(startOKLCH: color, toDestination: (x: color) => color, fromDestination: (x: color) => color): color {
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

export function clip(color: color): color {
	return color.map(val => {
		if (val < 0) {
			return 0;
		} else if (val > 1) {
			return 1;
		} else {
			return val;
		}
	}) as color;
}

export function inGamut(x: color): boolean {
	const [xX, xY, xZ] = x;
	return xX >= -0.0001 && xX <= 1.0001 && xY >= -0.0001 && xY <= 1.0001 && xZ >= -0.0001 && xZ <= 1.0001;
}

