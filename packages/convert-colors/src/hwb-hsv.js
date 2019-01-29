/**
* @func hwb2hsv
* @desc Return an HSV color from an HWB color
* @param {Number} h - Hue Angle (0 - 360)
* @param {Number} w - Whiteness (0 - 100)
* @param {Number} b - Blackness (0 - 100)
* @return {ArrayHSV}
* @example
* hwb2hsv(0, 0, 0) // => [0, 100, 100]
* @link https://en.wikipedia.org/wiki/HWB_color_model#Converting_to_and_from_HSV
*/

export function hwb2hsv(hwbH, hwbW, hwbB) {
	const [ hsvH, hsvS, hsvV ] = [
		hwbH,
		hwbB === 100 ? 0 : 100 - hwbW / (100 - hwbB) * 100,
		100 - hwbB
	];

	return [ hsvH, hsvS, hsvV ];
}


/**
* @func hsv2hwb
* @desc Return an HWB color from an HSV color
* @param {Number} h - Hue Angle (0 - 360)
* @param {Number} s - Saturation (0 - 100)
* @param {Number} v - Value (0 - 100)
* @return {ArrayHWB}
* @example
* hsv2hwb(0, 100, 100) // => [0, 0, 0]
* @link https://en.wikipedia.org/wiki/HWB_color_model#Converting_to_and_from_HSV
*/

export function hsv2hwb(hsvH, hsvS, hsvV) {
	const [ hwbH, hwbW, hwbB ] = [
		hsvH,
		(100 - hsvS) * hsvV / 100,
		100 - hsvV
	];

	return [ hwbH, hwbW, hwbB ];
}
