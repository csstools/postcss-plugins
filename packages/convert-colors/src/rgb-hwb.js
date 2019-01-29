import { rgb2hue, rgb2whiteness, rgb2value } from './util';
import { hsl2rgb } from './rgb-hsl';

/**
* @func rgb2hwb
* @desc Return an HWB color from an RGB color
* @param {Number} r - Red (0 - 100)
* @param {Number} g - Green (0 - 100)
* @param {Number} b - Blue (0 - 100)
* @param {Number} f - Hue Fallback (0 - 360)
* @return {ArrayHWB}
* @example
* rgb2hwb(100, 0, 0) // => [0, 0, 0]
* @link https://www.w3.org/TR/css-color-4/#hwb-to-rgb
* @link http://alvyray.com/Papers/CG/hwb2rgb.htm
*/

export function rgb2hwb(rgbR, rgbG, rgbB, fallbackhue) {
	const hwbH = rgb2hue(rgbR, rgbG, rgbB, fallbackhue);
	const hwbW = rgb2whiteness(rgbR, rgbG, rgbB);
	const hwbV = rgb2value(rgbR, rgbG, rgbB);
	const hwbB = 100 - hwbV;

	return [hwbH, hwbW, hwbB];
}

/**
* @func hwb2rgb
* @desc Return an RGB color from an HWB color
* @param {Number} h - Hue Angle (0 - 360)
* @param {Number} w - Whiteness (0 - 100)
* @param {Number} b - Blackness (0 - 100)
* @return {ArrayRGB}
* @example
* hwb2rgb(0, 0, 0) // => [100, 0, 0]
* @link https://www.w3.org/TR/css-color-4/#hwb-to-rgb
* @link http://alvyray.com/Papers/CG/hwb2rgb.htm
*/

export function hwb2rgb(hwbH, hwbW, hwbB, fallbackhue) {
	const [ rgbR, rgbG, rgbB ] = hsl2rgb(hwbH, 100, 50, fallbackhue).map(
		v => v * (100 - hwbW - hwbB) / 100 + hwbW
	);

	return [ rgbR, rgbG, rgbB ];
}
