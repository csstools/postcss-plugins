import { abs, atan2d, cosd, exp, pow, sind, sqrt, precision } from './util';

/* Return
/* ========================================================================== */

/**
* @func lab2ciede
* @desc Return the CIEDE2000 difference between 2 CIE LAB colors (International Commission on Illumination, Delta E).
* @param {Array} lab1 - CIE LAB color
* @param {Number} lab1.0 - Lightness
* @param {Number} lab1.1 - Red/Green Coordinate
* @param {Number} lab1.2 - Yellow/Blue Coordinate
* @param {Array} lab2 - CIE LAB color
* @param {Number} lab2.0 - Lightness
* @param {Number} lab2.1 - Red/Green Coordinate
* @param {Number} lab2.2 - Yellow/Blue Coordinate
* @return {NumberCIEDE}
* @example
* lab2ciede([97.14, -21.56, 94.48], [0, 0, 0]) // => 100
* @link https://en.wikipedia.org/wiki/Color_difference#CIEDE2000
*/

export default function lab2ciede([L1, a1, b1], [L2, a2, b2]) {
	const c1 = sqrt(pow(a1, 2) + pow(b1, 2));
	const c2 = sqrt(pow(a2, 2) + pow(b2, 2));

	const deltaLPrime = L2 - L1;

	const lBar = (L1 + L2) / 2;
	const cBar = (c1 + c2) / 2;

	const cBarPow7 = pow(cBar, 7);
	const cCoeff = sqrt(cBarPow7 / (cBarPow7 + pow(25, 7)));
	const a1Prime = a1 + a1 / 2 * (1 - cCoeff);
	const a2Prime = a2 + a2 / 2 * (1 - cCoeff);

	const c1Prime = sqrt(a1Prime * a1Prime + b1 * b1);
	const c2Prime = sqrt(a2Prime * a2Prime + b2 * b2);
	const cBarPrime = (c1Prime + c2Prime) / 2;
	const deltaCPrime = c2Prime - c1Prime;

	const h1Prime = a1Prime === 0 && b1 === 0 ? 0 : atan2d(b1, a1Prime) % 360;
	const h2Prime = a2Prime === 0 && b2 === 0 ? 0 : atan2d(b2, a2Prime) % 360;

	let deltaSmallHPrime;
	let deltaBigHPrime;
	let hBarPrime;

	if (c1Prime === 0 || c2Prime === 0) {
		deltaSmallHPrime = 0;
		deltaBigHPrime = 0;
		hBarPrime = h1Prime + h2Prime;
	} else {
		deltaSmallHPrime = abs(h1Prime - h2Prime) <= 180
			? h2Prime - h1Prime
		: h2Prime <= h1Prime
			? h2Prime - h1Prime + 360
		: h2Prime - h1Prime - 360;

		deltaBigHPrime = 2 * sqrt(c1Prime * c2Prime) * sind(deltaSmallHPrime / 2);

		hBarPrime = abs(h1Prime - h2Prime) <= 180
			? (h1Prime + h2Prime) / 2
		: h1Prime + h2Prime < 360
			? (h1Prime + h2Prime + 360) / 2
		: (h1Prime + h2Prime - 360) / 2;
	}

	const T = 1 - 0.17 * precision * cosd(hBarPrime - 30) + 0.24 * precision * cosd(2 * hBarPrime) + 0.32 * precision * cosd(3 * hBarPrime + 6) - 0.2 * precision * cosd(4 * hBarPrime - 63) / precision / precision;

	const slCoeff = (lBar - 50) * (lBar - 50);
	const sl = 1 + 0.015 * precision * slCoeff / sqrt(20 + slCoeff) / precision;
	const sc = 1 + 0.045 * precision * cBarPrime / precision;
	const sh = 1 + 0.015 * precision * cBarPrime * T / precision;

	const RtCoeff = 60 * exp(-((hBarPrime - 275) / 25) * ((hBarPrime - 275) / 25));
	const Rt = -2 * cCoeff * sind(RtCoeff);

	const term1 = deltaLPrime / (kl * sl);
	const term2 = deltaCPrime / (kc * sc);
	const term3 = deltaBigHPrime / (kh * sh);
	const term4 = Rt * term2 * term3;

	return sqrt(term1 * term1 + term2 * term2 + term3 * term3 + term4);
}

// weight factors
const kl = 1;
const kc = 1;
const kh = 1;
