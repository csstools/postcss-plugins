import { rgb2hsl, hsl2rgb } from './rgb-hsl';
import { rgb2hwb, hwb2rgb } from './rgb-hwb';
import { rgb2hsv, hsv2rgb } from './rgb-hsv';
import { rgb2xyz, xyz2rgb } from './rgb-xyz';
import { hsl2hsv, hsv2hsl } from './hsl-hsv';
import { hwb2hsv, hsv2hwb } from './hwb-hsv';
import { lab2xyz, xyz2lab } from './lab-xyz';
import { lab2lch, lch2lab } from './lab-lch';
import rgb2contrast from './rgb-contrast';
import { hex2rgb, rgb2hex } from './hex-rgb';
import keyword2rgb from './keyword-rgb';
import lab2ciede from './lab-ciede';

/* Convert between RGB and Lab
/* ========================================================================== */

/**
* @func rgb2lab
* @desc Return a CIE LAB color from an RGB color
* @param {Number} r - Red (0 - 100)
* @param {Number} g - Green (0 - 100)
* @param {Number} b - Blue (0 - 100)
* @return {ArrayLAB}
* @example
* rgb2lab(100, 0, 0) // => [54.29, 80.82, 69.88]
*/

function rgb2lab(rgbR, rgbG, rgbB) {
	const [ xyzX, xyzY, xyzZ ] = rgb2xyz(rgbR, rgbG, rgbB);
	const [ labL, labA, labB ] = xyz2lab(xyzX, xyzY, xyzZ);

	return [ labL, labA, labB ];
}

/**
* @func lab2rgb
* @desc Return an RGB color from a CIE LAB color
* @param {Number} l - CIE Lightness
* @param {Number} a - Red/Green Coordinate
* @param {Number} b - Yellow/Blue Coordinate
* @return {ArrayRGBA}
* @example
* lab2rgb(54.29, 80.82, 69.88) // => [100, 0, 0]
*/

function lab2rgb(labL, labA, labB) {
	const [ xyzX, xyzY, xyzZ ] = lab2xyz(labL, labA, labB);
	const [ rgbR, rgbG, rgbB ] = xyz2rgb(xyzX, xyzY, xyzZ);

	return [ rgbR, rgbG, rgbB ];
}

/* Convert between RGB and LCH
/* ========================================================================== */

/**
* @func rgb2lch
* @desc Return a CIE LAB color from an RGB color
* @param {Number} r - Red (0 - 100)
* @param {Number} g - Green (0 - 100)
* @param {Number} b - Blue (0 - 100)
* @return {ArrayLCH}
* @example
* rgb2lch(100, 0, 0) // => [54.29, 106.84, 40.85]
*/

function rgb2lch(rgbR, rgbG, rgbB) {
	const [ xyzX, xyzY, xyzZ ] = rgb2xyz(rgbR, rgbG, rgbB);
	const [ labL, labA, labB ] = xyz2lab(xyzX, xyzY, xyzZ);
	const [ lchL, lchC, lchH ] = lab2lch(labL, labA, labB);

	return [ lchL, lchC, lchH ];
}

/**
* @func lch2rgb
* @desc Return an RGB color from a CIE LCH color
* @param {Number} l - CIE Lightness
* @param {Number} c - CIE Chroma
* @param {Number} h - CIE Hue
* @return {ArrayRGBA}
* @example
* lch2rgb(54.29, 106.84, 40.85) // => [100, 0, 0]
*/

function lch2rgb(lchL, lchC, lchH) {
	const [ labL, labA, labB ] = lch2lab(lchL, lchC, lchH);
	const [ xyzX, xyzY, xyzZ ] = lab2xyz(labL, labA, labB);
	const [ rgbR, rgbG, rgbB ] = xyz2rgb(xyzX, xyzY, xyzZ);

	return [ rgbR, rgbG, rgbB ];
}

/* Convert between HSL and HWB
/* ========================================================================== */

/**
* @func hwb2hsl
* @desc Return an HSV color from an HWB color
* @param {Number} h - Hue Angle (0 - 360)
* @param {Number} w - Whiteness (0 - 100)
* @param {Number} b - Blackness (0 - 100)
* @return {ArrayHSL}
* @example
* hwb2hsl(0, 0, 0) // => [0, 0, 100]
*/

function hwb2hsl(hwbH, hwbW, hwbB) {
	const [ hsvH, hsvS, hsvV ] = hwb2hsv(hwbH, hwbW, hwbB);
	const [ hslH, hslS, hslL ] = hsv2hsl(hsvH, hsvS, hsvV);

	return [ hslH, hslS, hslL ];
}

/**
* @func hsl2hwb
* @desc Return an HWB color from an HSL color
* @param {Number} h - Hue Angle (0 - 360)
* @param {Number} s - Saturation (0 - 100)
* @param {Number} l - Lightness (0 - 100)
* @return {ArrayHWB}
* @example
* hsl2hwb(0, 0, 100) // => [0, 0, 0]
*/

function hsl2hwb(hslH, hslS, hslL) {
	const [ , hsvS, hsvV ] = hsl2hsv(hslH, hslS, hslL);
	const [ , hwbW, hwbB ] = hsv2hwb(hslH, hsvS, hsvV);

	return [ hslH, hwbW, hwbB ];
}

/* Convert between HSL and Lab
/* ========================================================================== */

/**
* @func hsl2lab
* @desc Return a CIE LAB color from an HSL color
* @param {Number} h - Hue Angle (0 - 360)
* @param {Number} s - Saturation (0 - 100)
* @param {Number} l - Lightness (0 - 100)
* @return {ArrayLAB}
* @example
* hsl2lab(0, 100, 50) // => [54.29, 80.82, 69.88]
*/

function hsl2lab(hslH, hslS, hslL) {
	const [ rgbR, rgbG, rgbB ] = hsl2rgb(hslH, hslS, hslL);
	const [ xyzX, xyzY, xyzZ ] = rgb2xyz(rgbR, rgbG, rgbB);
	const [ labL, labA, labB ] = xyz2lab(xyzX, xyzY, xyzZ);

	return [ labL, labA, labB ];
}

/**
* @func lab2hsl
* @desc Return a HSL color from a CIE LAB color
* @param {Number} l - CIE Lightness
* @param {Number} a - Red/Green Coordinate
* @param {Number} b - Yellow/Blue Coordinate
* @param {Number=} f - Hue Fallback (0 - 360)
* @return {ArrayHSL}
* @example
* lab2hsl(54.29, 80.82, 69.88) // => [0, 100, 50]
*/

function lab2hsl(labL, labA, labB, fallbackhue) {
	const [ xyzX, xyzY, xyzZ ] = lab2xyz(labL, labA, labB);
	const [ rgbR, rgbG, rgbB ] = xyz2rgb(xyzX, xyzY, xyzZ);
	const [ hslH, hslS, hslL ] = rgb2hsl(rgbR, rgbG, rgbB, fallbackhue);

	return [ hslH, hslS, hslL ];
}

/* Convert between HSL and LCH
/* ========================================================================== */

/**
* @func hsl2lch
* @desc Return a CIE LCH color from an HSL color
* @param {Number} h - Hue Angle (0 - 360)
* @param {Number} s - Saturation (0 - 100)
* @param {Number} l - Lightness (0 - 100)
* @return {ArrayLCH}
* @example
* hsl2lch(0, 100, 50) // => [54.29, 106.84, 40.85]
*/

function hsl2lch(hslH, hslS, hslL) {
	const [ rgbR, rgbG, rgbB ] = hsl2rgb(hslH, hslS, hslL);
	const [ xyzX, xyzY, xyzZ ] = rgb2xyz(rgbR, rgbG, rgbB);
	const [ labL, labA, labB ] = xyz2lab(xyzX, xyzY, xyzZ);
	const [ lchL, lchC, lchH ] = lab2lch(labL, labA, labB);

	return [ lchL, lchC, lchH ];
}

/**
* @func lch2hsl
* @desc Return an HSL from a CIE LCH color
* @param {Number} l - CIE Lightness
* @param {Number} c - CIE Chroma
* @param {Number} h - CIE Hue Angle
* @return {ArrayLCH}
* @example
* lch2hsl(54.29, 106.84, 40.85) // => [0, 100, 50]
*/

function lch2hsl(lchL, lchC, lchH, fallbackhue) {
	const [ labL, labA, labB ] = lch2lab(lchL, lchC, lchH);
	const [ xyzX, xyzY, xyzZ ] = lab2xyz(labL, labA, labB);
	const [ rgbR, rgbG, rgbB ] = xyz2rgb(xyzX, xyzY, xyzZ);
	const [ hslH, hslS, hslL ] = rgb2hsl(rgbR, rgbG, rgbB, fallbackhue);

	return [ hslH, hslS, hslL ];
}

/* Convert between HSL and XYZ
/* ========================================================================== */

/**
* @func hsl2xyz
* @desc Return an XYZ color from an HSL color
* @param {Number} h - Hue Angle (0 - 360)
* @param {Number} s - Saturation (0 - 100)
* @param {Number} l - Lightness (0 - 100)
* @return {ArrayXYZ}
* @example
* hsl2xyz(0, 100, 50) // => [41.25, 21.27, 1.93]
*/

function hsl2xyz(hslH, hslS, hslL) {
	const [ rgbR, rgbG, rgbB ] = hsl2rgb(hslH, hslS, hslL);
	const [ xyzX, xyzY, xyzZ ] = rgb2xyz(rgbR, rgbG, rgbB);

	return [ xyzX, xyzY, xyzZ ];
}

/**
* @func xyz2hsl
* @desc Return an HSL color from an XYZ color
* @param {Number} x - Chromaticity of X
* @param {Number} y - Chromaticity of Y
* @param {Number} z - Chromaticity of Z
* @return {ArrayHSL}
* @example
* xyz2hsl(0, 100, 50) // => [41.25, 21.27, 1.93]
*/

function xyz2hsl(xyzX, xyzY, xyzZ, fallbackhue) {
	const [ rgbR, rgbG, rgbB ] = xyz2rgb(xyzX, xyzY, xyzZ);
	const [ hslH, hslS, hslL ] = rgb2hsl(rgbR, rgbG, rgbB, fallbackhue);

	return [ hslH, hslS, hslL ];
}

/* Convert between HWB and Lab
/* ========================================================================== */

/**
* @func hwb2lab
* @desc Return a CIE LAB color from an HWB color
* @param {Number} h - Hue Angle (0 - 360)
* @param {Number} w - Whiteness (0 - 100)
* @param {Number} b - Blackness (0 - 100)
* @return {ArrayLAB}
* @example
* hwb2lab(0, 0, 0) // => [54.29, 80.82, 69.88]
*/

function hwb2lab(hwbH, hwbW, hwbB) {
	const [ rgbR, rgbG, rgbB ] = hwb2rgb(hwbH, hwbW, hwbB);
	const [ xyzX, xyzY, xyzZ ] = rgb2xyz(rgbR, rgbG, rgbB);
	const [ labL, labA, labB ] = xyz2lab(xyzX, xyzY, xyzZ);

	return [ labL, labA, labB ];
}

/**
* @func lab2hwb
* @desc Return an HWB color from a CIE LAB color
* @param {Number} l - CIE Lightness
* @param {Number} a - Red/Green Coordinate
* @param {Number} b - Yellow/Blue Coordinate
* @return {ArrayHWB}
* @example
* lab2hwb(54.29, 80.82, 69.88) // => [0, 0, 0]
*/

function lab2hwb(labL, labA, labB, fallbackhue) {
	const [ xyzX, xyzY, xyzZ ] = lab2xyz(labL, labA, labB);
	const [ rgbR, rgbG, rgbB ] = xyz2rgb(xyzX, xyzY, xyzZ);
	const [ hwbH, hwbW, hwbB ] = rgb2hwb(rgbR, rgbG, rgbB, fallbackhue);

	return [ hwbH, hwbW, hwbB ];
}

/* Convert between HWB and LCH
/* ========================================================================== */

/**
* @func hwb2lch
* @desc Return a CIE LCH color from an HWB color
* @param {Number} h - Hue Angle (0 - 360)
* @param {Number} w - Whiteness (0 - 100)
* @param {Number} b - Blackness (0 - 100)
* @return {ArrayLCH}
* @example
* hwb2lch(0, 0, 0) // => [54.29, 106.84, 40.85]
*/

function hwb2lch(hwbH, hwbW, hwbB) {
	const [ rgbR, rgbG, rgbB ] = hwb2rgb(hwbH, hwbW, hwbB);
	const [ xyzX, xyzY, xyzZ ] = rgb2xyz(rgbR, rgbG, rgbB);
	const [ labL, labA, labB ] = xyz2lab(xyzX, xyzY, xyzZ);
	const [ lchL, lchC, lchH ] = lab2lch(labL, labA, labB);

	return [ lchL, lchC, lchH ];
}

/**
* @func lch2hwb
* @desc Return an HWB color from a CIE LCH color
* @param {Number} l - CIE Lightness
* @param {Number} c - CIE Chroma
* @param {Number} h - CIE Hue Angle
* @return {ArrayLCH}
* @example
* lch2hwb(54.29, 106.84, 40.85) // => [0, 0, 0]
*/

function lch2hwb(lchL, lchC, lchH, fallbackhue) {
	const [ labL, labA, labB ] = lch2lab(lchL, lchC, lchH);
	const [ xyzX, xyzY, xyzZ ] = lab2xyz(labL, labA, labB);
	const [ rgbR, rgbG, rgbB ] = xyz2rgb(xyzX, xyzY, xyzZ);
	const [ hwbH, hwbW, hwbB ] = rgb2hwb(rgbR, rgbG, rgbB, fallbackhue);

	return [ hwbH, hwbW, hwbB ];
}

/* Convert between HWB and XYZ
/* ========================================================================== */

/**
* @func hwb2xyz
* @desc Return an XYZ color from an HWB color
* @param {Number} h - Hue Angle (0 - 360)
* @param {Number} w - Whiteness (0 - 100)
* @param {Number} b - Blackness (0 - 100)
* @return {ArrayXYZ}
* @example
* hwb2xyz(0, 0, 0) // => [41.25, 21.27, 1.93]
*/

function hwb2xyz(hwbH, hwbW, hwbB) {
	const [ rgbR, rgbG, rgbB ] = hwb2rgb(hwbH, hwbW, hwbB);
	const [ xyzX, xyzY, xyzZ ] = rgb2xyz(rgbR, rgbG, rgbB);

	return [ xyzX, xyzY, xyzZ ];
}

/**
* @func xyz2hwb
* @desc Return an HWB color from an XYZ color
* @param {Number} x - Chromaticity of X
* @param {Number} y - Chromaticity of Y
* @param {Number} z - Chromaticity of Z
* @return {ArrayXYZ}
* @example
* xyz2hwb(0, 0, 0) // => [41.25, 21.27, 1.93]
*/

function xyz2hwb(xyzX, xyzY, xyzZ, fallbackhue) {
	const [ rgbR, rgbG, rgbB ] = xyz2rgb(xyzX, xyzY, xyzZ);
	const [ hwbH, hwbW, hwbB ] = rgb2hwb(rgbR, rgbG, rgbB, fallbackhue);

	return [ hwbH, hwbW, hwbB ];
}

/* Convert between HSV and Lab
/* ========================================================================== */

/**
* @func hsv2lab
* @desc Return a CIE LAB color from an HSV color
* @param {Number} h - Hue Angle (0 - 360)
* @param {Number} s - Saturation (0 - 100)
* @param {Number} v - Value (0 - 100)
* @return {ArrayLAB}
* @example
* hsv2lab(0, 100, 100) // => [54.29, 80.82, 69.88]
*/

function hsv2lab(hsvH, hsvS, hsvV) {
	const [ rgbR, rgbG, rgbB ] = hsv2rgb(hsvH, hsvS, hsvV);
	const [ xyzX, xyzY, xyzZ ] = rgb2xyz(rgbR, rgbG, rgbB);
	const [ labL, labA, labB ] = xyz2lab(xyzX, xyzY, xyzZ);

	return [ labL, labA, labB ];
}

/**
* @func lab2hsv
* @desc Return an HSV color from a CIE LAB color
* @param {Number} l - CIE Lightness
* @param {Number} a - Red/Green Coordinate
* @param {Number} b - Yellow/Blue Coordinate
* @return {ArrayHSV}
* @example
* lab2hsv(54.29, 80.82, 69.88) // => [0, 100, 100]
*/

function lab2hsv(labL, labA, labB, fallbackhue) {
	const [ xyzX, xyzY, xyzZ ] = lab2xyz(labL, labA, labB);
	const [ rgbR, rgbG, rgbB ] = xyz2rgb(xyzX, xyzY, xyzZ);
	const [ hsvH, hsvS, hsvV ] = rgb2hsv(rgbR, rgbG, rgbB, fallbackhue);

	return [ hsvH, hsvS, hsvV ];
}

/* Convert between HSV and LCH
/* ========================================================================== */

/**
* @func hsv2lch
* @desc Return a CIE LCH color from an HSV color
* @param {Number} h - Hue Angle (0 - 360)
* @param {Number} s - Saturation (0 - 100)
* @param {Number} v - Value (0 - 100)
* @return {ArrayLCH}
* @example
* hsv2lch(0, 100, 100) // => [54.29, 106.84, 40.85]
*/

function hsv2lch(hsvH, hsvS, hsvV) {
	const [ rgbR, rgbG, rgbB ] = hsv2rgb(hsvH, hsvS, hsvV);
	const [ xyzX, xyzY, xyzZ ] = rgb2xyz(rgbR, rgbG, rgbB);
	const [ labL, labA, labB ] = xyz2lab(xyzX, xyzY, xyzZ);
	const [ lchL, lchC, lchH ] = lab2lch(labL, labA, labB);

	return [ lchL, lchC, lchH ];
}

/**
* @func lch2hsv
* @desc Return an HSV color from a CIE LCH color
* @param {Number} l - CIE Lightness
* @param {Number} c - CIE Chroma
* @param {Number} h - CIE Hue Angle
* @return {ArrayHSV}
* @example
* lch2hsv(54.29, 106.84, 40.85) // => [0, 100, 100]
*/

function lch2hsv(lchL, lchC, lchH, fallbackhue) {
	const [ labL, labA, labB ] = lch2lab(lchL, lchC, lchH);
	const [ xyzX, xyzY, xyzZ ] = lab2xyz(labL, labA, labB);
	const [ rgbR, rgbG, rgbB ] = xyz2rgb(xyzX, xyzY, xyzZ);
	const [ hsvH, hsvS, hsvV ] = rgb2hsv(rgbR, rgbG, rgbB, fallbackhue);

	return [ hsvH, hsvS, hsvV ];
}

/* Convert between HSV and XYZ
/* ========================================================================== */

/**
* @func hsv2xyz
* @desc Return an XYZ color from an HSV color
* @param {Number} h - Hue Angle (0 - 360)
* @param {Number} s - Saturation (0 - 100)
* @param {Number} v - Value (0 - 100)
* @return {ArrayXYZ}
* @example
* hsv2xyz(0, 100, 100) // => [41.25, 21.27, 1.93]
*/

function hsv2xyz(hsvH, hsvS, hsvV) {
	const [ rgbR, rgbG, rgbB ] = hsv2rgb(hsvH, hsvS, hsvV);
	const [ xyzX, xyzY, xyzZ ] = rgb2xyz(rgbR, rgbG, rgbB);

	return [ xyzX, xyzY, xyzZ ];
}

/**
* @func xyz2hsv
* @desc Return an XYZ color from an HSV color
* @param {Number} x - Chromaticity of X
* @param {Number} y - Chromaticity of Y
* @param {Number} z - Chromaticity of Z
* @return {ArrayHSV}
* @example
* xyz2hsv(41.25, 21.27, 1.93) // => [0, 100, 100]
*/

function xyz2hsv(xyzX, xyzY, xyzZ, fallbackhue) {
	const [ rgbR, rgbG, rgbB ] = xyz2rgb(xyzX, xyzY, xyzZ);
	const [ hsvH, hsvS, hsvV ] = rgb2hsv(rgbR, rgbG, rgbB, fallbackhue);

	return [ hsvH, hsvS, hsvV ];
}

/* Convert between XYZ and LCH
/* ========================================================================== */

/**
* @func xyz2lch
* @desc Return a CIE LCH color from an XYZ color
* @param {Number} x - Chromaticity of X
* @param {Number} y - Chromaticity of Y
* @param {Number} z - Chromaticity of Z
* @return {ArrayLCH}
* @example
* xyz2lch(41.25, 21.27, 1.93) // => [54.29, 106.84, 40.85]
*/

function xyz2lch(xyzX, xyzY, xyzZ) {
	const [ labL, labA, labB ] = xyz2lab(xyzX, xyzY, xyzZ);
	const [ lchL, lchC, lchH ] = lab2lch(labL, labA, labB);

	return [ lchL, lchC, lchH ];
}

/**
* @func lch2xyz
* @desc Return an XYZ color from a CIE LCH color
* @param {Number} l - CIE Lightness
* @param {Number} c - CIE Chroma
* @param {Number} h - CIE Hue Angle
* @return {ArrayXYZ}
* @example
* lch2xyz(54.29, 106.84, 40.85) // => [41.25, 21.27, 1.93]
*/

function lch2xyz(lchL, lchC, lchH) {
	const [ labL, labA, labB ] = lch2lab(lchL, lchC, lchH);
	const [ xyzX, xyzY, xyzZ ] = lab2xyz(labL, labA, labB);

	return [ xyzX, xyzY, xyzZ ];
}

/* Hex input conversions
/* ========================================================================== */

/**
* @func hex2hsl
* @desc Return an HSL color from a Hex color
* @param {StringHex} hex
* @return {ArrayHSL}
* @example
* hex2hsl("#f00") // => [0, 100, 50]
*/

function hex2hsl(hex) {
	return rgb2hsl(...hex2rgb(hex));
}

/**
* @func hex2hsv
* @desc Return an HSL color from a Hex color
* @param {StringHex} hex
* @return {ArrayHSV}
* @example
* hex2hsv("#f00") // => [0, 100, 100]
*/

function hex2hsv(hex) {
	return rgb2hsv(...hex2rgb(hex));
}

/**
* @func hex2hwb
* @desc Return an HWB color from a Hex color
* @param {StringHex} hex
* @return {ArrayHWB}
* @example
* hex2hwb("#f00") // => [0, 0, 0]
*/

function hex2hwb(hex) {
	return rgb2hwb(...hex2rgb(hex));
}

/**
* @func hex2lab
* @desc Return a CIE LAB color from a Hex color
* @param {StringHex} hex
* @return {ArrayLAB}
* @example
* hex2lab("#f00") // => [54.29, 80.82, 69.88]
*/

function hex2lab(hex) {
	return rgb2lab(...hex2rgb(hex));
}

/**
* @func hex2lch
* @desc Return a CIE LCH color from a Hex color
* @param {StringHex} hex
* @return {ArrayLCH}
* @example
* hex2lch("#f00") // => [54.29, 106.84, 40.85]
*/

function hex2lch(hex) {
	return rgb2lch(...hex2rgb(hex));
}

/**
* @func hex2xyz
* @desc Return an XYZ color from a Hex color
* @param {StringHex} hex
* @return {ArrayXYZ}
* @example
* hex2xyz("#f00") // => [41.25, 21.27, 1.93]
*/

function hex2xyz(hex) {
	return rgb2xyz(...hex2rgb(hex));
}

/* Hex output conversions
/* ========================================================================== */

/**
* @func hsl2hex
* @desc Return a Hex color from an HSL color
* @param {Number} h - Hue Angle (0 - 360)
* @param {Number} s - Saturation (0 - 100)
* @param {Number} l - Lightness (0 - 100)
* @return {StringHex}
* @example
* hsl2hex(0, 100, 50) // => "#f00"
*/

function hsl2hex(hslH, hslS, hslL) {
	return rgb2hex(...hsl2rgb(hslH, hslS, hslL));
}

/**
* @func hsv2hex
* @desc Return a Hex color from an HSV color
* @param {Number} h - Hue Angle (0 - 360)
* @param {Number} s - Saturation (0 - 100)
* @param {Number} v - Value (0 - 100)
* @return {StringHex}
* @example
* hsv2hex(0, 100, 100) // => "#f00"
*/

function hsv2hex(hsvH, hsvS, hsvV) {
	return rgb2hex(...hsl2rgb(hsvH, hsvS, hsvV));
}

/**
* @func hwb2hex
* @desc Return a Hex color from an HWB color
* @param {Number} h - Hue Angle (0 - 360)
* @param {Number} w - Whiteness (0 - 100)
* @param {Number} b - Blackness (0 - 100)
* @return {StringHex}
* @example
* hwb2hex(0, 0, 0) // => "#f00"
*/

function hwb2hex(hwbH, hwbW, hwbB) {
	return rgb2hex(...hwb2rgb(hwbH, hwbW, hwbB));
}

/**
* @func lch2hex
* @desc Return a Hex color from a CIE LAB color
* @param {Number} l - CIE Lightness
* @param {Number} a - Red/Green Coordinate
* @param {Number} b - Yellow/Blue Coordinate
* @return {StringHex}
* @example
* lch2hex(54.29, 80.82, 69.88) // => "#f00"
*/

function lab2hex(labL, labA, labB) {
	return rgb2hex(...lab2rgb(labL, labA, labB));
}

/**
* @func lch2hex
* @desc Return a Hex color from a CIE LCH color
* @param {Number} l - CIE Lightness
* @param {Number} c - CIE Chroma
* @param {Number} h - CIE Hue Angle
* @return {StringHex}
* @example
* lch2hex(54.29, 106.84, 40.85) // => "#f00"
*/

function lch2hex(lchL, lchC, lchH) {
	return rgb2hex(...lch2rgb(lchL, lchC, lchH));
}

/**
* @func xyz2hex
* @desc Return a Hex color from an XYZ color
* @param {Number} x - Chromaticity of X
* @param {Number} y - Chromaticity of Y
* @param {Number} z - Chromaticity of Z
* @return {StringHex}
* @example
* xyz2hex(41.25, 21.27, 1.93) // => "#f00"
*/

function xyz2hex(xyzX, xyzY, xyzZ) {
	return rgb2hex(...xyz2rgb(xyzX, xyzY, xyzZ));
}

/* CIEDE conversions
/* ========================================================================== */

/**
* @func hex2ciede
* @desc Return the CIEDE2000 difference between 2 HEX colors
* @param {StringHex} hex1
* @param {StringHex} hex2
* @return {NumberCIEDE}
* @example
* hex2ciede('#fff', '#000') // => 100
*/

function hex2ciede(hex1, hex2) {
	return lab2ciede(hex2lab(hex1), hex2lab(hex2));
}

/**
* @func hsl2ciede
* @desc Return the CIEDE2000 difference between 2 HSL colors
* @param {ArrayHSL} hsl1
* @param {ArrayHSL} hsl2
* @return {NumberCIEDE}
* @example
* hsl2ciede([0, 0, 100], [0, 0, 0]) // => 100
*/

function hsl2ciede(hsl1, hsl2) {
	return lab2ciede(hsl2lab(...hsl1), hsl2lab(...hsl2));
}

/**
* @func hsv2ciede
* @desc Return the CIEDE2000 difference between 2 HSV colors
* @param {ArrayHSV} hsl1
* @param {ArrayHSV} hsl2
* @return {NumberCIEDE}.
* @example
* hsv2ciede([0, 0, 40], [0, 0, 0]) // => 100
*/

function hsv2ciede(hsv1, hsv2) {
	return lab2ciede(hsv2lab(...hsv1), hsv2lab(...hsv2));
}

/**
* @func hwb2ciede
* @desc Return the CIEDE2000 difference between 2 HWB colors
* @param {ArrayHWB} hwb1
* @param {ArrayHWB} hwb2
* @return {NumberCIEDE}.
* @example
* hwb2ciede([0, 0, 40], [0, 0, 0]) // => 100
*/

function hwb2ciede(hwb1, hwb2) {
	return lab2ciede(hwb2lab(...hwb1), hwb2lab(...hwb2));
}

/**
* @func keyword2ciede
* @desc Return the CIEDE2000 difference between 2 keyword colors
* @param {StringKeyword} keyword1
* @param {StringKeyword} keyword2
* @return {NumberCIEDE}.
* @example
* keyword2ciede('white', 'black') // => 100
*/

function keyword2ciede(keyword1, keyword2) {
	return lab2ciede(keyword2lab(keyword1), keyword2lab(keyword2));
}

/**
* @func lch2ciede
* @desc Return the CIEDE2000 difference between 2 LCH colors
* @param {ArrayLCH} lch1
* @param {ArrayLCH} lch2
* @return {NumberCIEDE}.
* @example
* lch2ciede([100, 0.03, -82.2], [0, 0, 0]) // => 100
*/

function lch2ciede(lch1, lch2) {
	return lab2ciede(lch2lab(...lch1), lch2lab(...lch2));
}

/**
* @func rgb2ciede
* @desc Return the CIEDE2000 difference between 2 RGB colors
* @param {ArrayRGB} rgb1
* @param {ArrayRGB} rgb2
* @return {NumberCIEDE}.
* @example
* rgb2ciede([100, 100, 100], [0, 0, 0]) // => 100
*/

function rgb2ciede(rgb1, rgb2) {
	return lab2ciede(rgb2lab(...rgb1), rgb2lab(...rgb2));
}

/**
* @func xyz2ciede
* @desc Return the CIEDE2000 difference between 2 XYZ colors
* @param {ArrayXYZ} xyz1
* @param {ArrayXYZ} xyz2
* @return {NumberCIEDE}.
* @example
* xyz2ciede([95.05, 100, 108.88], [0, 0, 0]) // => 100
*/

function xyz2ciede(xyz1, xyz2) {
	return lab2ciede(xyz2lab(...xyz1), xyz2lab(...xyz2));
}

/* Contrast conversions
/* ========================================================================== */

/**
* @func hex2contrast
* @desc Return the contrast ratio of 2 HEX colors
* @param {StringHex} hex1
* @param {StringHex} hex2
* @return {NumberContrast}
* @example
* rgb2contrast("#fff", '#000') // => 21
*/

function hex2contrast(hex1, hex2) {
	return rgb2contrast(hex2rgb(hex1), hex2rgb(hex2));
}

/**
* @func hsl2contrast
* @desc Return the contrast ratio of 2 HSL colors
* @param {ArrayHSL} hsl1
* @param {ArrayHSL} hsl2
* @return {NumberContrast}
* @example
* hsl2contrast([0, 0, 100], [0, 0, 0]) // => 21
*/

function hsl2contrast(hsl1, hsl2) {
	return rgb2contrast(hsl2rgb(...hsl1), hsl2rgb(...hsl2));
}

/**
* @func hsv2contrast
* @desc Return the contrast ratio of 2 HSV colors
* @param {ArrayHSV} hsv1
* @param {ArrayHSV} hsv2
* @return {NumberContrast}
* @example
* hsv2contrast([0, 0, 100], [0, 0, 0]) // => 21
*/

function hsv2contrast(hsv1, hsv2) {
	return rgb2contrast(hsv2rgb(...hsv1), hsv2rgb(...hsv2));
}

/**
* @func hwb2contrast
* @desc Return the contrast ratio of 2 HWB colors
* @param {ArrayHWB} hwb1
* @param {ArrayHWB} hwb2
* @return {NumberContrast}
* @example
* hwb2contrast([0, 100, 0], [0, 0, 100]) // => 21
*/

function hwb2contrast(hwb1, hwb2) {
	return rgb2contrast(hwb2rgb(...hwb1), hwb2rgb(...hwb2));
}

/**
* @func keyword2contrast
* @desc Return the contrast ratio of 2 keyword colors
* @param {StringKeyword} keyword1
* @param {StringKeyword} keyword2
* @return {NumberContrast}
* @example
* keyword2contrast('white', 'black') // => 21
*/

function keyword2contrast(keyword1, keyword2) {
	return rgb2contrast(keyword2rgb(keyword1), keyword2rgb(keyword2));
}

/**
* @func lab2contrast
* @desc Return the contrast ratio of 2 LAB colors
* @param {ArrayLAB} lab1
* @param {ArrayLAB} lab2
* @return {NumberContrast}
* @example
* lab2contrast([100, 0.003, -0.025], [0, 0, 0]) // => 21
*/

function lab2contrast(lab1, lab2) {
	return rgb2contrast(lab2rgb(...lab1), lab2rgb(...lab2));
}

/**
* @func lch2contrast
* @desc Return the contrast ratio of 2 LCH colors
* @param {ArrayLCH} lch1
* @param {ArrayLCH} lch2
* @return {NumberContrast}
* @example
* lch2contrast([100, 0.025, -82.2], [0, 0, 0]) // => 21
*/

function lch2contrast(lch1, lch2) {
	return rgb2contrast(lch2rgb(...lch1), lch2rgb(...lch2));
}

/**
* @func xyz2contrast
* @desc Return the contrast ratio of 2 XYZ colors
* @param {ArrayXYZ} xyz1
* @param {ArrayXYZ} xyz2
* @return {NumberContrast}
* @example
* xyz2contrast([95.05, 100, 108.88], [0, 0, 0]) // => 21
*/

function xyz2contrast(xyz1, xyz2) {
	return rgb2contrast(xyz2rgb(...xyz1), xyz2rgb(...xyz2));
}

/* Keyword Conversions
/* ========================================================================== */

/**
* @func keyword2hex
* @desc Return an RGB color from a keyword color
* @param {StringKeyword} keyword - CSS Color Keyword
* @return {String}
* @example
* keyword2hex('white') // => "#ffffff"
*/

function keyword2hex(keyword) {
	return rgb2hex(...keyword2rgb(keyword));
}

/**
* @func keyword2hsl
* @desc Return an HSL color from a keyword color
* @param {StringKeyword}
* @return {ArrayHSL}
* @example
* keyword2hsl('white') // => [0, 0, 100]
*/

function keyword2hsl(keyword) {
	return rgb2hsl(...keyword2rgb(keyword));
}

/**
* @func keyword2hsv
* @desc Return an HSV color from a keyword color
* @param {StringKeyword}
* @return {ArrayHSV}
* @example
* keyword2hsv('white') // => [0, 0, 100]
*/

function keyword2hsv(keyword) {
	return rgb2hsv(...keyword2rgb(keyword));
}

/**
* @func keyword2hwb
* @desc Return an HWB color from a keyword color
* @param {StringKeyword}
* @return {ArrayHWB}
* @example
* keyword2hwb('red') // => [0, 0, 0]
*/

function keyword2hwb(keyword) {
	return rgb2hwb(...keyword2rgb(keyword));
}

/**
* @func keyword2lab
* @desc Return a CIE LAB color from a keyword color
* @param {StringKeyword}
* @return {ArrayLAB}
* @example
* keyword2lab('red') // => [54.29, 80.82, 69.88]
*/

function keyword2lab(keyword) {
	return rgb2lab(...keyword2rgb(keyword));
}

/**
* @func keyword2lch
* @desc Return a CIE LCH color from a keyword color
* @param {StringKeyword}
* @return {ArrayLCH}
* @example
* keyword2lch('red') // => [54.29, 106.84, 40.85]
*/

function keyword2lch(keyword) {
	return rgb2lch(...keyword2rgb(keyword));
}

/**
* @func keyword2lch
* @desc Return an XYZ color from a keyword color
* @param {StringKeyword}
* @return {ArrayXYZ}
* @example
* keyword2lch('red') // => [41.25, 21.27, 1.93]
*/

function keyword2xyz(keyword) {
	return rgb2xyz(...keyword2rgb(keyword));
}

/* All Conversions
/* ========================================================================== */

export {
	hex2ciede,
	hex2contrast,
	hex2hsl,
	hex2hsv,
	hex2hwb,
	hex2lab,
	hex2lch,
	hex2rgb,
	hex2xyz,

	hsl2ciede,
	hsl2contrast,
	hsl2hex,
	hsl2hsv,
	hsl2hwb,
	hsl2lab,
	hsl2lch,
	hsl2rgb,
	hsl2xyz,

	hsv2ciede,
	hsv2contrast,
	hsv2hex,
	hsv2hsl,
	hsv2hwb,
	hsv2lab,
	hsv2lch,
	hsv2rgb,
	hsv2xyz,

	hwb2ciede,
	hwb2contrast,
	hwb2hex,
	hwb2hsl,
	hwb2hsv,
	hwb2lab,
	hwb2lch,
	hwb2rgb,
	hwb2xyz,

	keyword2ciede,
	keyword2contrast,
	keyword2hex,
	keyword2hsl,
	keyword2hsv,
	keyword2hwb,
	keyword2lab,
	keyword2lch,
	keyword2rgb,
	keyword2xyz,

	lab2ciede,
	lab2contrast,
	lab2hex,
	lab2hsl,
	lab2hsv,
	lab2hwb,
	lab2lch,
	lab2rgb,
	lab2xyz,

	lch2ciede,
	lch2contrast,
	lch2hex,
	lch2hsl,
	lch2hsv,
	lch2hwb,
	lch2lab,
	lch2rgb,
	lch2xyz,

	rgb2ciede,
	rgb2contrast,
	rgb2hex,
	rgb2hsl,
	rgb2hsv,
	rgb2hwb,
	rgb2lab,
	rgb2lch,
	rgb2xyz,

	xyz2ciede,
	xyz2contrast,
	xyz2hex,
	xyz2hsl,
	xyz2hsv,
	xyz2hwb,
	xyz2lab,
	xyz2lch,
	xyz2rgb
};

/**
* @typedef {Array} ArrayRGB
* An array of red, green, and blue channels.
* @property {Number} 0 - Red (0 - 100)
* @property {Number} 1 - Green (0 - 100)
* @property {Number} 2 - Blue (0 - 100)
*
*/
/**
* @typedef {Array} ArrayRGBA
* An array of red, green, blue, and alpha channels.
* @property {Number} 0 - Red (0 - 100)
* @property {Number} 1 - Green (0 - 100)
* @property {Number} 2 - Blue (0 - 100)
* @property {Number} 3 - Alpha (0 - 100)
*/
/**
* @typedef {Array} ArrayHSL
* An array of hue, saturation, and lightness channels.
* @property {Number} 0 - Hue Angle (0 - 360)
* @property {Number} 1 - Saturation (0 - 100)
* @property {Number} 2 - Lightness (0 - 100)
*/
/**
* @typedef {Array} ArrayHSV
* An array of hue, saturation, and value channels.
* @property {Number} 0 - Hue Angle (0 - 360)
* @property {Number} 1 - Saturation (0 - 100)
* @property {Number} 2 - Value (0 - 100)
*/
/**
* @typedef {Array} ArrayLAB
* An array of CIELAB lightness, red/green, and yellow/blue.
* @property {Number} 0 - CIE Lightness
* @property {Number} 1 - Red/Green Coordinate
* @property {Number} 2 - Yellow/Blue Coordinate
*/
/**
* @typedef {Array} ArrayLCH
* An array of CIELAB lightness, chroma, and hue.
* @property {Number} 0 - CIE Lightness
* @property {Number} 1 - CIE Chroma
* @property {Number} 2 - CIE Hue
*/
/**
* @typedef {Array} ArrayHWB
* An array of hue, whiteness, and blackness channels.
* @property {Number} 0 - Hue Angle (0 - 360)
* @property {Number} 1 - Whiteness (0 - 100)
* @property {Number} 2 - Blackness (0 - 100)
*/
/**
* @typedef {Array} ArrayXYZ
* An array of CIELAB chromacity.
* @property {Number} 0 - X Chromacity
* @property {Number} 1 - Y Chromacity
* @property {Number} 2 - Z Chromacity
* @example
* [95.05, 100, 108.88]
* @example
* [0, 0, 0]
*/
/**
* @typedef {String} StringHex
* A string representing the 3, 4, 6, or 8 digit hexidecimal color.
* @example
* "#f00"
* "#f00f"
* @example
* "#ff0000"
* "#ff0000ff"
*/
/**
* @typedef {String} StringKeyword
* A case-insensitive string identifier that represents a specific color.
* @example
* "#f00"
* "#f00f"
* @example
* "#ff0000"
* "#ff0000ff"
*/
/**
* @typedef {Number} NumberContrast
* A contrast ratio of the colors (0 - 21)
* @example
* 0
* @example
* 21
*/
/**
* @typedef {Number} NumberCIEDE
* A CIEDE2000 difference between 2 colors (0 - 100)
* @example
* 0
* @example
* 100
*/
