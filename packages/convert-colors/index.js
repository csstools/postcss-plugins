/* Colorspace Conversions
/* ========================================================================== */

/* Convert Red/Green/Blue to Hue/Saturation/Lightness
/* ========================================================================== */

function convertRGBtoHSL(red, green, blue, fallbackhue = 0) {
	const hue        = convertRGBtoH(red, green, blue, fallbackhue);
	const whiteness  = convertRGBtoW(red, green, blue);
	const value      = convertRGBtoV(red, green, blue);
	const lightness  = convertWVtoL(whiteness, value);
	const saturation = convertLVWtoS(lightness, value, whiteness);

	return [ hue, saturation, lightness ];
}

/* Convert Red/Green/Blue to Hue/Whiteness/Blackness
/* ========================================================================== */

function convertRGBtoHWB(red, green, blue, fallbackhue = 0) {
	const hue       = convertRGBtoH(red, green, blue, fallbackhue);
	const whiteness = convertRGBtoW(red, green, blue);
	const value     = convertRGBtoV(red, green, blue);
	const blackness = invert(value);

	return [ hue, whiteness, blackness ];
}

/* Convert Red/Green/Blue to Hue/Saturation/Value
/* ========================================================================== */

function convertRGBtoHSV(red, green, blue, fallbackhue = 0) {
	const hue        = convertRGBtoH(red, green, blue, fallbackhue);
	const whiteness  = convertRGBtoW(red, green, blue);
	const value      = convertRGBtoV(red, green, blue);
	const lightness  = convertWVtoL(whiteness, value);
	const saturation = convertLVWtoS(lightness, value, whiteness);

	return [ hue, saturation, value ];
}

/* Convert Hue/Saturation/Lightness to Red/Green/Blue
/* ========================================================================== */

function convertHSLtoRGB(hue, saturation, lightness) {
	const hexagon = hue / 60;

	const t2 = lightness <= 50
		? lightness * (saturation + 100) / 10000
	: (lightness + saturation) / 100 - lightness * saturation / 10000;

	const t1 = lightness * 0.02 - t2;

	const red   = convertTTHtoChannel(t1, t2, hexagon + 2) * 100;
	const green = convertTTHtoChannel(t1, t2, hexagon) * 100;
	const blue  = convertTTHtoChannel(t1, t2, hexagon - 2) * 100;

	return [red, green, blue];
}

/* Convert Hue/Saturation/Lightness to Hue/Whiteness/Blackness
/* ========================================================================== */

function convertHSLtoHWB(hue, saturationHSL, lightnessHSL) {
	const t          = convertSLtoT(saturationHSL, lightnessHSL);
	const value      = convertLTtoV(lightnessHSL, t);
	const saturation = convertLTVtoS(lightnessHSL, t, value);
	const whiteness  = convertSVtoW(saturation, value);
	const blackness  = invert(value);

	return [hue, whiteness, blackness];
}

/* Convert Hue/Whiteness/Blackness to Red/Green/Blue
/* ========================================================================== */

function convertHWBtoRGB(hue, whiteness, blackness) {
	const [ , saturationHSV, value ] = convertHWBtoHSV(hue, whiteness, blackness);
	const lightness = convertSVtoL(saturationHSV, value);
	const saturation = convertSVLtoS(saturationHSV, value, lightness);
	const hexagon = hue / 60;

	const t2 = lightness <= 50
		? lightness * (saturation + 100) / 10000
	: (lightness + saturation) / 100 - lightness * saturation / 10000;

	const t1 = lightness * 0.02 - t2;

	const red   = convertTTHtoChannel(t1, t2, hexagon + 2) * 100;
	const green = convertTTHtoChannel(t1, t2, hexagon) * 100;
	const blue  = convertTTHtoChannel(t1, t2, hexagon - 2) * 100;

	return [red, green, blue];
}

/* Convert Hue/Whiteness/Blackness to Hue/Saturation/Lightness
/* ========================================================================== */

function convertHWBtoHSL(hue, whiteness, blackness) {
	const saturationHSV = convertWBtoS(whiteness, blackness);
	const value = invert(blackness);
	const lightness = convertSVtoL(saturationHSV, value);
	const saturation = convertSVLtoS(saturationHSV, value, lightness);

	return [hue, saturation, lightness];
}

/* Convert between Red/Green/Blue and Linear-Light RGB
/* ========================================================================== */

function convertRGBtoLRGB(sr, sg, sb) {
	const [ lr, lg, lb ] = [ sr, sg, sb ].map(convertRGBVtoLRGBV);

	return [ lr, lg, lb ];
}

function convertLRGBtoRGB(lr, lg, lb) {
	const [ sr, sg, sb ] = [ lr, lg, lb ].map(convertLRGBVtoRGBV);

	return [ sr, sg, sb ];
}

function convertRGBVtoLRGBV(v) {
	return v <= 4.045
		? v / 12.92
	: Math.pow((v + 5.5) / 105.5, 2.4) * 100;
}

function convertLRGBVtoRGBV(v) {
	return v > 0.31308
		? 1.055 * Math.pow(v / 100, 1 / 2.4) * 100 - 5.5
	: 12.92 * v;
}

/* Convert between Linear-Light Red/Green/Blue and CIE XYZ
/* ========================================================================== */

function convertLRGBtoXYZ(lr, lg, lb) {
	const [ x, y, z ] = matrix([ lr, lg, lb ], [
		[0.4124564, 0.3575761, 0.1804375],
		[0.2126729, 0.7151522, 0.0721750],
		[0.0193339, 0.1191920, 0.9503041]
	]);

	return [ x, y, z ];
}

function convertXYZtoLRGB(x, y, z) {
	const [ lr, lg, lb ] = matrix([ x, y, z ], [
		[ 3.2404542, -1.5371385, -0.4985314],
		[-0.9692660,  1.8760108,  0.0415560],
		[ 0.0556434, -0.2040259,  1.0572252]
	]);

	return [ lr, lg, lb ];
}

/* Convert between CIE XYZ and D50 XYZ
/* ========================================================================== */

function convertXYZtoD50XYZ(x, y, z) {
	const [ d50x, d50y, d50z ] = matrix([ x, y, z ], [
		[ 1.0478112, 0.0228866, -0.0501270],
		[ 0.0295424, 0.9904844, -0.0170491],
		[-0.0092345, 0.0150436,  0.7521316]
	]);

	return [ d50x, d50y, d50z ];
}

function convertD50XYZtoXYZ(d50x, d50y, d50z) {
	const [ x, y, z ] = [
		d50x *  0.9555766 + d50y * -0.0230393 + d50z *  0.0631636,
		d50x * -0.0282895 + d50y *  1.0099416 + d50z *  0.0210077,
		d50z *  0.0122982 + d50y * -0.0204830 + d50z *  1.3299098
	];

	return [ x, y, z ];
}

/* Convert between D50 XYZ and LAB
/* ========================================================================== */

function convertD50XYZtoLAB(d50x, d50y, d50z) {
	const [ f1, f2, f3 ] = [
		d50x / wX,
		d50y / wY,
		d50z / wZ
	].map(
		value => value > epsilon
			? Math.cbrt(value)
		: (kappa * value + 16) / 116
	);

	const [ l, a, b ] = [
		116 * f2 - 16,
		500 * (f1 - f2),
		200 * (f2 - f3)
	];

	return [ l, a, b ];
}

function convertLABtoD50XYZ(l, a, b) {
	const f2 = (l + 16) / 116;
	const f1 = a / 500 + f2;
	const f3 = f2 - b / 200;

	const [ wx, wy, wz ] = [
		Math.pow(f1, 3) > epsilon ? Math.pow(f1, 3)             : (116 * f1 - 16) / kappa,
		l > kappa * epsilon       ? Math.pow((l + 16) / 116, 3) : l / kappa,
		Math.pow(f3, 3) > epsilon ? Math.pow(f3, 3)            : (116 * f3 - 16) / kappa
	];

	const [ d50x, d50y, d50z ] = [
		wx * wX,
		wy * wY,
		wz * wZ
	];

	return [ d50x, d50y, d50z ];
}

/* Combination Conversions
/* ========================================================================== */

function convertRGBtoXYZ(rgbR, rgbG, rgbB) {
	const [ lrgbR, lrgbG, lrgbB ] = convertRGBtoLRGB(rgbR, rgbG, rgbB);
	const [ d65x,  d65y,  d65z  ] = convertLRGBtoXYZ(lrgbR, lrgbG, lrgbB);

	return [ d65x, d65y, d65z ];
}

function convertXYZtoRGB(xyzX, xyzY, xyzZ) {
	const [ lrgbR, lrgbG, lrgbB ] = convertXYZtoLRGB(xyzX, xyzY, xyzZ);
	const [ rgbR,  rgbG,  rgbB  ] = convertLRGBtoRGB(lrgbR, lrgbG, lrgbB);

	return [ rgbR, rgbG, rgbB ];
}

function convertRGBtoLAB(rgbR, rgbG, rgbB) {
	const [ lrgbR, lrgbG, lrgbB ] = convertRGBtoLRGB(rgbR, rgbG, rgbB);
	const [ xyzX,  xyzY,  xyzZ  ] = convertLRGBtoXYZ(lrgbR, lrgbG, lrgbB);
	const [ d50x,  d50y,  d50z  ] = convertXYZtoD50XYZ(xyzX, xyzY, xyzZ);
	const [ labL,  labA,  labB  ] = convertD50XYZtoLAB(d50x, d50y, d50z);

	return [ labL, labA, labB ];
}

function convertLABtoRGB(labL, labA, labB) {
	const [ d50x,  d50y,  d50z  ] = convertLABtoD50XYZ(labL, labA, labB);
	const [ xyzX,  xyzY,  xyzZ  ] = convertD50XYZtoXYZ(d50x, d50y, d50z);
	const [ lrgbR, lrgbG, lrgbB ] = convertXYZtoLRGB(xyzX, xyzY, xyzZ);
	const [ rgbR,  rgbG,  rgbB  ] = convertLRGBtoRGB(lrgbR, lrgbG, lrgbB);

	return [ rgbR, rgbG, rgbB ];
}

function convertHSLtoLAB(hslH, hslS, hslL) {
	const [ rgbR, rgbG, rgbB ] = convertHSLtoRGB(hslH, hslS, hslL);
	const [ labL, labA, labB ] = convertRGBtoLAB(rgbR, rgbG, rgbB);

	return [ labL, labA, labB ];
}

function convertLABtoHSL(labL, labA, labB) {
	const [ rgbR, rgbG, rgbB ] = convertLABtoRGB(labL, labA, labB);
	const [ hslH, hslS, hslL ] = convertRGBtoLAB(rgbR, rgbG, rgbB);

	return [ hslH, hslS, hslL ];
}

function convertHWBtoLAB(hwbH, hwbW, hwbB) {
	const [ rgbR, rgbG, rgbB ] = convertHWBtoRGB(hwbH, hwbW, hwbB);
	const [ labL, labA, labB ] = convertRGBtoLAB(rgbR, rgbG, rgbB);

	return [ labL, labA, labB ];
}

function convertLABtoHWB(labL, labA, labB) {
	const [ rgbR, rgbG, rgbB ] = convertLABtoRGB(labL, labA, labB);
	const [ hslH, hslS, hslL ] = convertRGBtoHSL(rgbR, rgbG, rgbB);

	return [ hslH, hslS, hslL ];
}

function convertLABtoHSV(labL, labA, labB) {
	const [ hwbH, hwbW, hwbB ] = convertLABtoHWB(labL, labA, labB);
	const [ hsvH, hsvS, hsvV ] = convertHWBtoHSV(hwbH, hwbW, hwbB);

	return [ hsvH, hsvS, hsvV ];
}

/* Conversion Tooling
/* ========================================================================== */

/* Convert Red/Green/Blue to Hue
/* ========================================================================== */

function convertRGBtoH(red, green, blue, fallbackhue = 0) {
	const whiteness = convertRGBtoW(red, green, blue);
	const value     = convertRGBtoV(red, green, blue);
	const chroma    = convertVWtoC(value, whiteness);

	if (chroma === 0) {
		return fallbackhue;
	} else {
		const segment = value === red
			? (green - blue) / chroma
		: value === green
			? (blue - red) / chroma
		: (red - green) / chroma;

		const shift = value === red
			? segment < 0
				? 360 / 60
				: 0 / 60
		: value === green
			? 120 / 60
		: 240 / 60;

		const hue = (segment + shift) * 60;

		return hue;
	}
}

/* Convert Red/Green/Blue to Whiteness
/* ========================================================================== */

function convertRGBtoW(red, green, blue) {
	return Math.min(red, green, blue);
}

/* Convert Red/Green/Blue to Value
/* ========================================================================== */

function convertRGBtoV(red, green, blue) {
	return Math.max(red, green, blue);
}

/* Convert Value/Whiteness to Chroma
/* ========================================================================== */

function convertVWtoC(value, whiteness) {
	return value - whiteness;
}

/* Convert Whiteness/Value to Lightness
/* ========================================================================== */

function convertWVtoL(whiteness, value) {
	return (whiteness + value) / 2;
}

/* Convert Lightness/Value/Whiteness to Saturation
/* ========================================================================== */

function convertLVWtoS(lightness, value, whiteness) {
	return whiteness === value
		? 0
	: lightness < 50
		? (value - whiteness) / (value + whiteness) * 100
	: (value - whiteness) / (200 - value - whiteness) * 100;
}

/* Convert T1/T2/Hexagon to Channel
/* ========================================================================== */

function convertTTHtoChannel(t1, t2, hexagon) {
	const althexagon = hexagon < 0
		? hexagon + 6
	: hexagon >= 6
		? hexagon - 6
	: hexagon;

	return althexagon < 1
		? (t2 - t1) * althexagon + t1
	: althexagon < 3
		? t2
	: althexagon < 4
		? (t2 - t1) * (4 - althexagon) + t1
	: t1;
}

/* Convert Hue/Whiteness/Blackness to Hue/Saturation/Value
/* ========================================================================== */

function convertHWBtoHSV(hue, whiteness, blackness) {
	const saturation = convertWBtoS(whiteness, blackness);
	const value = invert(blackness);

	return [ hue, saturation, value ];
}

/* Convert Hue/Saturation/Lightness to Hue/Saturation/Value
/* ========================================================================== */

function convertHSLtoHSV(hue, saturationHSL, lightness) {
	const t          = convertSLtoT(saturationHSL, lightness);
	const value      = convertLTtoV(lightness, t);
	const saturation = convertLTVtoS(lightness, t, value);

	return [hue, saturation, value]
}

/* Convert Hue/Saturation/Value to Hue/Saturation/Lightness
/* ========================================================================== */

function convertHSVtoHSL(hue, saturationHSV, value) {
	const lightness = convertSVtoL(saturationHSV, value);
	const saturation = convertSVLtoS(saturationHSV, value, lightness);

	return [hue, saturation, lightness]
}

/* Convert Hue/Saturation/Value to Hue/Whiteness/Blackness
/* ========================================================================== */

function convertHSVtoHWB(hue, saturationHSV, valueHSV) {
	const whiteness = convertSVtoW(saturationHSV, valueHSV);
	const blackness = invert(valueHSV);

	return [hue, whiteness, blackness];
}

/* Convert Whiteness/Blackness to Saturation
/* ========================================================================== */

function convertWBtoS(whiteness, blackness) {
	return blackness === 100 ? 0 : Math.max(0, invert(whiteness / invert(blackness) * 100) || 0);
}

/* Convert Saturation/Value to Whiteness
/* ========================================================================== */

function convertSVtoW(saturationHSV, valueHSV) {
	return invert(saturationHSV) * valueHSV / 100;
}

/* Convert Saturation/Value to Lightness
/* ========================================================================== */

function convertSVtoL(saturation, value) {
	return (200 - saturation) * value / 200;
}

/* Convert Saturation/Value/Lightness to Saturation
/* ========================================================================== */

function convertSVLtoS(saturation, value, lightness) {
	return saturation * value / (lightness === 100 || lightness === 0 ? 1 : lightness < 50 ? lightness * 2 : 200 - lightness * 2);
}

/* Convert Saturation/Lightness to T
/* ========================================================================== */

function convertSLtoT(saturation, lightness) {
	return saturation * (lightness < 50 ? lightness : invert(lightness)) / 100;
}

/* Convert Lightness/T to Value
/* ========================================================================== */

function convertLTtoV(lightness, t) {
	return lightness + t;
}

/* Convert Lightness/T/Value to Saturation
/* ========================================================================== */

function convertLTVtoS(lightness, t, value) {
	return lightness > 0 ? 2 * t / value * 100 : 0;
}

/* Invert a Percentage
/* ========================================================================== */

function invert(percentage) {
	return 100 - percentage;
}

/* Calculate a Matrix
/* ========================================================================== */

function matrix(params, mats) {
	return mats.map(mat => mat.reduce((acc, value, index) => acc + params[index] * value, 0));
}

/* Variables
/* ========================================================================== */

// epsilon
const epsilon = Math.pow(6, 3) / Math.pow(29, 3);

// kappa
const kappa = Math.pow(29, 3) / Math.pow(3, 3);

// reference white (D50 XYZ)
const [ wX, wY, wZ ] = [ 96.42, 100, 82.49 ];

/* Export Conversions
/* ========================================================================== */

export default {
	rgb2hsl: convertRGBtoHSL,
	rgb2hwb: convertRGBtoHWB,
	rgb2lab: convertRGBtoLAB,
	rgb2hsv: convertRGBtoHSV,

	hsl2rgb: convertHSLtoRGB,
	hsl2hwb: convertHSLtoHWB,
	hsl2lab: convertHSLtoLAB,
	hsl2hsv: convertHSLtoHSV,

	hwb2rgb: convertHWBtoRGB,
	hwb2hsl: convertHWBtoHSL,
	hwb2lab: convertHWBtoLAB,
	hwb2hsv: convertHWBtoHSV,

	lab2rgb: convertLABtoRGB,
	lab2hsl: convertLABtoHSL,
	lab2hwb: convertLABtoHWB,
	lab2hsv: convertLABtoHSV,

	hsv2hsl: convertHSVtoHSL,
	hsv2hwb: convertHSVtoHWB,

	rgb2xyz: convertRGBtoXYZ,
	xyz2rgb: convertXYZtoRGB,

	rgb2hue: convertRGBtoH
};
