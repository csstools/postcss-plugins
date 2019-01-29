import { luminance2contrast, pow, precision } from './util'

/**
* @func rgb2contrast
* @desc Return the contrast ratio of of RGB colors
* @param {ArrayRGB} rgb1 - RGB Color Array
* @param {ArrayRGB} rgb2 - RGB Color Array
* @return {NumberContrast}
* @example
* rgb2contrast([100, 0, 0], [0, 0, 0]) // => 5.252
* @link https://www.w3.org/TR/WCAG21/#dfn-contrast-ratio
*/

export default function rgb2contrast(rgb1, rgb2) {
	const luminance1 = rgb2luminance(...rgb1);
	const luminance2 = rgb2luminance(...rgb2);

	return luminance2contrast(luminance1, luminance2);
}

/**
* @private
* @func rgb2luminance
* @desc Return the relative brightness of RGB
* @param {Number} r - Red (0 - 100)
* @param {Number} g - Green (0 - 100)
* @param {Number} b - Blue (0 - 100)
* @return {Number} Relative luminance of the color
* @example
* rgb2luminance(100, 0, 0) // => 0.2126
* @link https://www.w3.org/TR/WCAG21/#dfn-relative-luminance
*/

export function rgb2luminance(rgbR, rgbG, rgbB) {
	return (adjustChannel(rgbR) * coefficientR + adjustChannel(rgbG) * coefficientG + adjustChannel(rgbB) * coefficientB) / precision;
}

// low-gamma adjust coefficients
const adjustChannel = x => x <= 3.928 ? x / lowc : adjustGamma(x);
const adjustGamma = x => pow((x + 5.5) / 105.5, 2.4);
const lowc = 1292;

// red/green/blue coefficients
const coefficientR = 0.2126 * precision;
const coefficientG = 0.7152 * precision;
const coefficientB = 0.0722 * precision;
