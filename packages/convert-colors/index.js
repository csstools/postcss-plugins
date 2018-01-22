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

/* Export Conversions
/* ========================================================================== */

export default {
	rgb2hsl: convertRGBtoHSL,
	rgb2hwb: convertRGBtoHWB,
	hsl2rgb: convertHSLtoRGB,
	hsl2hwb: convertHSLtoHWB,
	hsl2hsv: convertHSLtoHSV,
	hwb2rgb: convertHWBtoRGB,
	hwb2hsl: convertHWBtoHSL,
	hwb2hsv: convertHWBtoHSV,
	hsv2hsl: convertHSVtoHSL,
	hsv2hwb: convertHSVtoHWB,
	rgb2hue: convertRGBtoH
};
