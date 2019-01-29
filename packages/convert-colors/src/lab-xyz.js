import { cbrt, epsilon, kappa, pow, wd50X, wd50Y, wd50Z, matrix } from './util';

/**
* @func lab2xyz
* @desc Return an XYZ color from a LAB color
* @param {Number} l - CIE Lightness
* @param {Number} a - Red/Green Coordinate
* @param {Number} b - Yellow/Blue Coordinate
* @return {ArrayXYZ}
* @example
* lab2xyz(54.29, 80.82, 69.88) // => 41.25, 21.27, 1.93
* @link https://www.w3.org/TR/css-color-4/#rgb-to-lab
* @link https://www.w3.org/TR/css-color-4/#color-conversion-code
* @link https://www.easyrgb.com/en/math.php
*/

export function lab2xyz(labL, labA, labB) {
	// compute f, starting with the luminance-related term
	const f2 = (labL + 16) / 116;
	const f1 = labA / 500 + f2;
	const f3 = f2 - labB / 200;

	// compute pre-scaled XYZ
	const [ initX, initY, initZ ] = [
		pow(f1, 3) > epsilon   ? pow(f1, 3)                : (116 * f1 - 16) / kappa,
		labL > kappa * epsilon ? pow((labL + 16) / 116, 3) : labL / kappa,
		pow(f3, 3) > epsilon   ? pow(f3, 3)                : (116 * f3 - 16) / kappa
	];

	const [ xyzX, xyzY, xyzZ ] = matrix(
		// compute XYZ by scaling pre-scaled XYZ by reference white
		[ initX * wd50X, initY * wd50Y, initZ * wd50Z ],
		// calculate D65 XYZ from D50 XYZ
		[
			[ 0.9555766, -0.0230393,  0.0631636],
			[-0.0282895,  1.0099416,  0.0210077],
			[ 0.0122982, -0.0204830,  1.3299098]
		]
	);

	return [ xyzX, xyzY, xyzZ ];
}

/**
* @func xyz2lab
* @desc Return an LAB color from a XYZ color
* @param {Number} x - Chromaticity of X
* @param {Number} y - Chromaticity of Y
* @param {Number} z - Chromaticity of Z
* @return {ArrayLAB}
* @example
* xyz2lab(41.25, 21.27, 1.93) // => [54.29, 80.82, 69.88]
* @link https://www.w3.org/TR/css-color-4/#rgb-to-lab
* @link https://www.w3.org/TR/css-color-4/#color-conversion-code
* @link https://www.easyrgb.com/en/math.php
*/

export function xyz2lab(xyzX, xyzY, xyzZ) {
	// calculate D50 XYZ from D65 XYZ
	const [ d50X, d50Y, d50Z ] = matrix([ xyzX, xyzY, xyzZ ], [
		[ 1.0478112,  0.0228866, -0.0501270],
		[ 0.0295424,  0.9904844, -0.0170491],
		[-0.0092345,  0.0150436,  0.7521316]
	]);

	// calculate f
	const [ f1, f2, f3 ] = [
		d50X / wd50X,
		d50Y / wd50Y,
		d50Z / wd50Z
	].map(
		value => value > epsilon ? cbrt(value) : (kappa * value + 16) / 116
	);

	const [ labL, labA, labB ] = [
		116 * f2 - 16,
		500 * (f1 - f2),
		200 * (f2 - f3)
	];

	return [ labL, labA, labB ];
}
