/* Convert Degree to Hue Degree
/* ========================================================================== */

export function convertDtoD(deg) {
	return deg % 360;
}

/* Convert Gradian to Hue Degree
/* ========================================================================== */

export function convertGtoD(grad) {
	return grad * 0.9 % 360;
}

/* Convert Radian to Hue Degree
/* ========================================================================== */

export function convertRtoD(rad) {
	return rad * 180 / Math.PI % 360;
}

/* Convert Turn to Hue Degree
/* ========================================================================== */

export function convertTtoD(turn) {
	return turn * 360 % 360;
}

/* Convert Red/Green/Blue to Red/Green/Blue (0 - 255)
/* ========================================================================== */

export function convertRGBtoRGB255(red, green, blue) {
	const red255   = convertChannelToChannel255(red);
	const green255 = convertChannelToChannel255(green);
	const blue255  = convertChannelToChannel255(blue);

	return [red255, green255, blue255];
}

/* Convert Red/Green/Blue to Hue/Saturation/Lightness
/* ========================================================================== */

export function convertRGBtoHSL(red, green, blue, fallbackHue = 0) {
	const hue        = convertRGBtoH(red, green, blue, fallbackHue);
	const whiteness  = convertRGBtoW(red, green, blue);
	const value      = convertRGBtoV(red, green, blue);
	const lightness  = convertWVtoL(whiteness, value);
	const saturation = convertLVWtoS(lightness, value, whiteness);

	return [ hue, saturation, lightness ];
}

/* Convert Red/Green/Blue to Hue/Whiteness/Blackness
/* ========================================================================== */

export function convertRGBtoHWB(red, green, blue, fallbackHue = 0) {
	const hue       = convertRGBtoH(red, green, blue, fallbackHue);
	const whiteness = convertRGBtoW(red, green, blue);
	const value     = convertRGBtoV(red, green, blue);
	const blackness = convertVtoB(value);

	return [ hue, whiteness, blackness ];
}

/* Convert Hue/Saturation/Lightness to Red/Green/Blue (and fallback Hue)
/* ========================================================================== */

export function convertHSLtoRGB(hue, saturation, lightness) {
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

export function convertHSLtoHWB(hue, saturation, lightness) {
	const [ red, green, blue ] = convertHSLtoRGB(hue, saturation, lightness);
	const [ , whiteness, blackness ] = convertRGBtoHWB(red, green, blue, hue);

	return [ hue, whiteness, blackness ];
}

/* Convert Hue/Whiteness/Blackness to Hue/Saturation/Lightness
/* ========================================================================== */

export function convertHWBtoHSL(hue, whiteness, blackness) {
	const [ red, green, blue ] = convertHWBtoRGB(hue, whiteness, blackness);
	const [ , saturation, lightness ] = convertRGBtoHSL(red, green, blue, hue);

	return [ hue, saturation, lightness ];
}

/* Convert Hue/Whiteness/Blackness to Red/Green/Blue (and fallback Hue)
/* ========================================================================== */

export function convertHWBtoRGB(hue, whiteness, blackness) {
	const [ hslRed, hslGreen, hslBlue ] = convertHSLtoRGB(hue, 100, 50);

	const tot = whiteness + blackness;
	const w = tot > 100 ? whiteness / tot * 100 : whiteness;
	const b = tot > 100 ? blackness / tot * 100 : blackness;

	const red   = hslRed   * (100 - w - b) / 100 + w;
	const green = hslGreen * (100 - w - b) / 100 + w;
	const blue  = hslBlue  * (100 - w - b) / 100 + w;

	return [red, green, blue];
}

/* Convert Channel to Channel (0 - 255)
/* ========================================================================== */

export function convertChannelToChannel255(channel) {
	return Math.round(channel * 2.55);
}

/* Convert Red/Green/Blue to Hue
/* ========================================================================== */

export function convertRGBtoH(red, green, blue, fallbackHue = 0) {
	const whiteness = convertRGBtoW(red, green, blue);
	const value     = convertRGBtoV(red, green, blue);
	const chroma    = convertVWtoC(value, whiteness);

	if (chroma === 0) {
		return fallbackHue;
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

export function convertRGBtoW(red, green, blue) {
	return Math.min(red, green, blue);
}

/* Convert Red/Green/Blue to Value
/* ========================================================================== */

export function convertRGBtoV(red, green, blue) {
	return Math.max(red, green, blue);
}

/* Convert Value/Whiteness to Chroma
/* ========================================================================== */

export function convertVWtoC(value, whiteness) {
	return value - whiteness;
}

/* Convert Whiteness/Value to Lightness
/* ========================================================================== */

export function convertWVtoL(whiteness, value) {
	return (whiteness + value) / 2;
}

/* Convert Lightness/Value/Whiteness to Saturation
/* ========================================================================== */

export function convertLVWtoS(lightness, value, whiteness) {
	return whiteness === value
		? 0
	: lightness < 50
		? (value - whiteness) / (value + whiteness) * 100
	: (value - whiteness) / (200 - value - whiteness) * 100;
}

/* Convert Value to Blackness
/* ========================================================================== */

export function convertVtoB(value) {
	return 100 - value;
}

/* Convert Hue parts to Channel
/* ========================================================================== */

export function convertTTHtoChannel(t1, t2, hexagon) {
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

/* Convert a Name to Red/Green/Blue
/* ========================================================================== */

export function convertNtoRGB(name) {
	const names = {
		aliceblue: [240, 248, 255],
		antiquewhite: [250, 235, 215],
		aqua: [0, 255, 255],
		aquamarine: [127, 255, 212],
		azure: [240, 255, 255],
		beige: [245, 245, 220],
		bisque: [255, 228, 196],
		black: [0, 0, 0],
		blanchedalmond: [255, 235, 205],
		blue: [0, 0, 255],
		blueviolet: [138, 43, 226],
		brown: [165, 42, 42],
		burlywood: [222, 184, 135],
		cadetblue: [95, 158, 160],
		chartreuse: [127, 255, 0],
		chocolate: [210, 105, 30],
		coral: [255, 127, 80],
		cornflowerblue: [100, 149, 237],
		cornsilk: [255, 248, 220],
		crimson: [220, 20, 60],
		cyan: [0, 255, 255],
		darkblue: [0, 0, 139],
		darkcyan: [0, 139, 139],
		darkgoldenrod: [184, 134, 11],
		darkgray: [169, 169, 169],
		darkgreen: [0, 100, 0],
		darkgrey: [169, 169, 169],
		darkkhaki: [189, 183, 107],
		darkmagenta: [139, 0, 139],
		darkolivegreen: [85, 107, 47],
		darkorange: [255, 140, 0],
		darkorchid: [153, 50, 204],
		darkred: [139, 0, 0],
		darksalmon: [233, 150, 122],
		darkseagreen: [143, 188, 143],
		darkslateblue: [72, 61, 139],
		darkslategray: [47, 79, 79],
		darkslategrey: [47, 79, 79],
		darkturquoise: [0, 206, 209],
		darkviolet: [148, 0, 211],
		deeppink: [255, 20, 147],
		deepskyblue: [0, 191, 255],
		dimgray: [105, 105, 105],
		dimgrey: [105, 105, 105],
		dodgerblue: [30, 144, 255],
		firebrick: [178, 34, 34],
		floralwhite: [255, 250, 240],
		forestgreen: [34, 139, 34],
		fuchsia: [255, 0, 255],
		gainsboro: [220, 220, 220],
		ghostwhite: [248, 248, 255],
		gold: [255, 215, 0],
		goldenrod: [218, 165, 32],
		gray: [128, 128, 128],
		green: [0, 128, 0],
		greenyellow: [173, 255, 47],
		grey: [128, 128, 128],
		honeydew: [240, 255, 240],
		hotpink: [255, 105, 180],
		indianred: [205, 92, 92],
		indigo: [75, 0, 130],
		ivory: [255, 255, 240],
		khaki: [240, 230, 140],
		lavender: [230, 230, 250],
		lavenderblush: [255, 240, 245],
		lawngreen: [124, 252, 0],
		lemonchiffon: [255, 250, 205],
		lightblue: [173, 216, 230],
		lightcoral: [240, 128, 128],
		lightcyan: [224, 255, 255],
		lightgoldenrodyellow: [250, 250, 210],
		lightgray: [211, 211, 211],
		lightgreen: [144, 238, 144],
		lightgrey: [211, 211, 211],
		lightpink: [255, 182, 193],
		lightsalmon: [255, 160, 122],
		lightseagreen: [32, 178, 170],
		lightskyblue: [135, 206, 250],
		lightslategray: [119, 136, 153],
		lightslategrey: [119, 136, 153],
		lightsteelblue: [176, 196, 222],
		lightyellow: [255, 255, 224],
		lime: [0, 255, 0],
		limegreen: [50, 205, 50],
		linen: [250, 240, 230],
		magenta: [255, 0, 255],
		maroon: [128, 0, 0],
		mediumaquamarine: [102, 205, 170],
		mediumblue: [0, 0, 205],
		mediumorchid: [186, 85, 211],
		mediumpurple: [147, 112, 219],
		mediumseagreen: [60, 179, 113],
		mediumslateblue: [123, 104, 238],
		mediumspringgreen: [0, 250, 154],
		mediumturquoise: [72, 209, 204],
		mediumvioletred: [199, 21, 133],
		midnightblue: [25, 25, 112],
		mintcream: [245, 255, 250],
		mistyrose: [255, 228, 225],
		moccasin: [255, 228, 181],
		navajowhite: [255, 222, 173],
		navy: [0, 0, 128],
		oldlace: [253, 245, 230],
		olive: [128, 128, 0],
		olivedrab: [107, 142, 35],
		orange: [255, 165, 0],
		orangered: [255, 69, 0],
		orchid: [218, 112, 214],
		palegoldenrod: [238, 232, 170],
		palegreen: [152, 251, 152],
		paleturquoise: [175, 238, 238],
		palevioletred: [219, 112, 147],
		papayawhip: [255, 239, 213],
		peachpuff: [255, 218, 185],
		peru: [205, 133, 63],
		pink: [255, 192, 203],
		plum: [221, 160, 221],
		powderblue: [176, 224, 230],
		purple: [128, 0, 128],
		rebeccapurple: [102, 51, 153],
		red: [255, 0, 0],
		rosybrown: [188, 143, 143],
		royalblue: [65, 105, 225],
		saddlebrown: [139, 69, 19],
		salmon: [250, 128, 114],
		sandybrown: [244, 164, 96],
		seagreen: [46, 139, 87],
		seashell: [255, 245, 238],
		sienna: [160, 82, 45],
		silver: [192, 192, 192],
		skyblue: [135, 206, 235],
		slateblue: [106, 90, 205],
		slategray: [112, 128, 144],
		slategrey: [112, 128, 144],
		snow: [255, 250, 250],
		springgreen: [0, 255, 127],
		steelblue: [70, 130, 180],
		tan: [210, 180, 140],
		teal: [0, 128, 128],
		thistle: [216, 191, 216],
		tomato: [255, 99, 71],
		turquoise: [64, 224, 208],
		violet: [238, 130, 238],
		wheat: [245, 222, 179],
		white: [255, 255, 255],
		whitesmoke: [245, 245, 245],
		yellow: [255, 255, 0],
		yellowgreen: [154, 205, 50]
	};

	return names[name];
}
