import { rgb2value, rgb2whiteness, rgb2hue } from './util';

/* Convert between RGB and HSV
/* ========================================================================== */

// http://alvyray.com/Papers/CG/hsv2rgb.htm

export function rgb2hsv(rgbR, rgbG, rgbB) {
	const hsvV = rgb2value(rgbR, rgbG, rgbB);
	const hsvW = rgb2whiteness(rgbR, rgbG, rgbB);
	const hsvH = rgb2hue(rgbR, rgbG, rgbB);

	// calculate saturation
	const hsvS = hsvV === hsvW ? 0 : (hsvV - hsvW) / hsvV * 100;

	return [ hsvH, hsvS, hsvV ];
}

export function hsv2rgb(hsvH, hsvS, hsvV) {
	const rgbI = Math.floor(hsvH / 60);

	// calculate rgb parts
	const rgbF = (hsvH / 60 - rgbI) & 1 ? hsvH / 60 - rgbI : 1 - hsvH / 60 - rgbI;
	const rgbM = hsvV * (100 - hsvS) / 100;
	const rgbN = hsvV * (100 - hsvS * rgbF) / 100;

	switch (rgbI) {
		case 6:
		case 0: return [hsvV, rgbN, rgbM];
		case 1: return [rgbN, hsvV, rgbM];
		case 2: return [rgbM, hsvV, rgbN];
		case 3: return [rgbM, rgbN, hsvV];
		case 4: return [rgbN, rgbM, hsvV];
		case 5: return [hsvV, rgbM, rgbN];
	}
}
