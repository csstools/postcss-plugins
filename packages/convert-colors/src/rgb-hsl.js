import { abs, rgb2hue, rgb2value, rgb2whiteness, hue2rgb } from './util';

/**
* @func rgb2hsl
* @desc Return a HSL color from an RGB color
* @param {Number} r - red (0 - 100)
* @param {Number} g - green (0 - 100)
* @param {Number} b - blue (0 - 100)
* @param {Number=} f - Hue Fallback (0 - 360)
* @return {ArrayHSL}
* @example
* rgb2hsl(0, 100, 100) // => [0, 100, 50]
* @link https://www.w3.org/TR/css-color-3/#hsl-color
* @link https://www.w3.org/TR/css-color-4/#hsl-to-rgb
* @link https://www.rapidtables.com/convert/color/rgb-to-hsl.html
* @link https://www.rapidtables.com/convert/color/hsl-to-rgb.html
*/

export function rgb2hsl(rgbR, rgbG, rgbB, fallbackhue) {
	const hslH = rgb2hue(rgbR, rgbG, rgbB, fallbackhue);
	const hslV = rgb2value(rgbR, rgbG, rgbB);
	const hslW = rgb2whiteness(rgbR, rgbG, rgbB);

	// calculate value/whiteness delta
	const hslD = hslV - hslW;

	// calculate lightness
	const hslL = (hslV + hslW) / 2;

	// calculate saturation
	const hslS = hslD === 0 ? 0 : hslD / (100 - abs(2 * hslL - 100)) * 100;

	return [ hslH, hslS, hslL ];
}

/**
* @func hsl2rgb
* @desc Return an RGB color from an HSL color
* @param {Number} h - Hue Angle (0 - 360)
* @param {Number} s - Saturation (0 - 100)
* @param {Number} l - Lightness (0 - 100)
* @return {ArrayRGB}
* @example
* hsl2rgb(0, 100, 50) // => [0, 100, 100]
* @link https://www.w3.org/TR/css-color-3/#hsl-color
* @link https://www.w3.org/TR/css-color-4/#hsl-to-rgb
* @link https://www.rapidtables.com/convert/color/rgb-to-hsl.html
* @link https://www.rapidtables.com/convert/color/hsl-to-rgb.html
*/

export function hsl2rgb(hslH, hslS, hslL) {
	// calcuate t2
	const t2 = hslL <= 50 ? hslL * (hslS + 100) / 100 : hslL + hslS - hslL * hslS / 100;

	// calcuate t1
	const t1 = hslL * 2 - t2;

	// calculate rgb
	const [ rgbR, rgbG, rgbB ] = [
		hue2rgb(t1, t2, hslH + 120),
		hue2rgb(t1, t2, hslH),
		hue2rgb(t1, t2, hslH - 120)
	];

	return [ rgbR, rgbG, rgbB ];
}
