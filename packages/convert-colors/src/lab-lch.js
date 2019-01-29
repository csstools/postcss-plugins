import { atan2, cosd, pow, rad2deg, sind, sqrt } from './util';

/**
* @func lab2lch
* @desc Return an LCH color from a LAB color
* @param {Number} l - CIE Lightness
* @param {Number} a - Red/Green Coordinate
* @param {Number} b - Yellow/Blue Coordinate
* @return {ArrayLAB}
* @example
* lab2lch(54.29, 80.82, 69.88) // => [54.29, 106.84, 40.85]
* @link https://www.w3.org/TR/css-color-4/#color-conversion-code
* @link https://www.w3.org/TR/css-color-4/#lch-to-lab
*/

export function lab2lch(labL, labA, labB) {
	const [ lchC, lchH ] = [
		sqrt(pow(labA, 2) + pow(labB, 2)), // convert to chroma
		rad2deg(atan2(labB, labA)) // convert to hue, in degrees
	];

	return [ labL, lchC, lchH ];
}

/**
* @func lch2lab
* @desc Return a LAB color from an LCH color
* @param {Number} l - CIE Lightness
* @param {Number} c - CIE Chroma
* @param {Number} h - CIE Hue Angle
* @return {ArrayLCH}
* @example
* lch2lab(54.29, 106.84, 40.85) // => [54.29, 80.82, 69.88]
* @link https://www.w3.org/TR/css-color-4/#color-conversion-code
* @link https://www.w3.org/TR/css-color-4/#lch-to-lab
*/

export function lch2lab(lchL, lchC, lchH) {
	// convert to Lab a and b from the polar form
	const [ labA, labB ] = [
		lchC * cosd(lchH),
		lchC * sind(lchH)
	];

	return [ lchL, labA, labB ];
}
