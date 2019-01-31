import { floor, rgb2value, rgb2whiteness, rgb2hue } from './util';

/**
* @func rgb2hsv
* @desc Return an HSV color from an RGB color
* @param {Number} h - Hue Angle (0 - 360)
* @param {Number} s - Saturation (0 - 100)
* @param {Number} v - Value (0 - 100)
* @param {Number=} f - Hue Fallback (0 - 360)
* @return {ArrayHSV}
* @example
* rgb2hsv(100, 0, 0) // => [0, 100, 100]
* @link http://alvyray.com/Papers/CG/hsv2rgb.htm
*/

export function rgb2hsv(rgbR, rgbG, rgbB, fallbackhue) {
	const hsvV = rgb2value(rgbR, rgbG, rgbB);
	const hsvW = rgb2whiteness(rgbR, rgbG, rgbB);
	const hsvH = rgb2hue(rgbR, rgbG, rgbB, fallbackhue);

	// calculate saturation
	const hsvS = hsvV === hsvW ? 0 : (hsvV - hsvW) / hsvV * 100;

	return [ hsvH, hsvS, hsvV ];
}

/**
* @func hsv2rgb
* @desc Return an RGB color from an HSV color
* @param {Number} h - Hue Angle (0 - 360)
* @param {Number} s - Saturation (0 - 100)
* @param {Number} v - Value (0 - 100)
* @return {ArrayRGB}
* @example
* hsv2rgb(100, 0, 0) // => [100, 0, 0]
* @link http://alvyray.com/Papers/CG/hsv2rgb.htm
*/

export function hsv2rgb(hsvH, hsvS, hsvV) {
	const rgbI = floor(hsvH / 60);

	// calculate rgb parts
	const rgbF = hsvH / 60 - rgbI & 1 ? hsvH / 60 - rgbI : 1 - hsvH / 60 - rgbI;
	const rgbM = hsvV * (100 - hsvS) / 100;
	const rgbN = hsvV * (100 - hsvS * rgbF) / 100;
	const rgbT = hsvV * (100 - (100 - rgbF) * hsvS / 100) / 100;

	const [ rgbR, rgbG, rgbB ] = rgbI === 5
		? [ hsvV, rgbM, rgbN ]
	: rgbI === 4
		? [ rgbT, rgbM, hsvV ]
	: rgbI === 3
		? [ rgbM, rgbN, hsvV ]
	: rgbI === 2
		? [ rgbM, hsvV, rgbT ]
	: rgbI === 1
		? [ rgbN, hsvV, rgbM ]
	: [ hsvV, rgbT, rgbM ];

	return [ rgbR, rgbG, rgbB ];
}
