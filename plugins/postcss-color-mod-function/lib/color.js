import number from 'big.js';

export default class Color {
	constructor(color) {
		this.color = Object(Object(color).color || color);

		if (color.colorspace === 'rgb') {
			this.color.hue = rgb2hue(color.red, color.green, color.blue, color.hue || 0);
		}
	}

	alpha(alpha) {
		const color = this.color;

		return alpha === undefined
			? color.alpha
		: new Color(assign(color, { alpha }));
	}

	blackness(blackness) {
		const hwb = color2hwb(this.color);

		return blackness === undefined
			? hwb.blackness
		: new Color(assign(hwb, { blackness }));
	}

	blend(color, percentage, colorspace = 'rgb') {
		const base = this.color;

		return new Color(blend(base, color, percentage, colorspace));
	}

	blenda(color, percentage, colorspace = 'rgb') {
		const base = this.color;

		return new Color(blend(base, color, percentage, colorspace, true));
	}

	blue(blue) {
		const rgb = color2rgb(this.color);

		return blue === undefined
			? rgb.blue
		: new Color(assign(rgb, { blue }));
	}

	contrast(percentage) {
		const base = this.color;

		return new Color(contrast(base, percentage));
	}

	green(green) {
		const rgb = color2rgb(this.color);

		return green === undefined
			? rgb.green
		: new Color(assign(rgb, { green }));
	}

	hue(hue) {
		const hsl = color2hsl(this.color);

		return hue === undefined
			? hsl.hue
		: new Color(assign(hsl, { hue }));
	}

	lightness(lightness) {
		const hsl = color2hsl(this.color);

		return lightness === undefined
			? hsl.lightness
		: new Color(assign(hsl, { lightness }))
	}

	red(red) {
		const rgb = color2rgb(this.color);

		return red === undefined
			? rgb.red
		: new Color(assign(rgb, { red }));
	}

	rgb(red, green, blue) {
		const rgb = color2rgb(this.color);

		return new Color(assign(rgb, { red, green, blue }));
	}

	saturation(saturation) {
		const hsl = color2hsl(this.color);

		return saturation === undefined
			? hsl.saturation
		: new Color(assign(hsl, { saturation }));
	}

	shade(percentage) {
		const hwb = color2hwb(this.color);
		const shade = { hue: 0, whiteness: 0, blackness: 100, colorspace: 'hwb' };
		const colorspace = 'rgb';

		return percentage === undefined
			? hwb.blackness
		: new Color(blend(hwb, shade, percentage, colorspace));
	}

	tint(percentage) {
		const hwb = color2hwb(this.color);
		const tint = { hue: 0, whiteness: 100, blackness: 0, colorspace: 'hwb' };
		const colorspace = 'rgb';

		return percentage === undefined
			? hwb.blackness
		: new Color(blend(hwb, tint, percentage, colorspace));
	}

	whiteness(whiteness) {
		const hwb = color2hwb(this.color);

		return whiteness === undefined
			? hwb.whiteness
		: new Color(assign(hwb, { whiteness }));
	}

	toHSL() {
		return color2hslString(this.color);
	}

	toHWB() {
		return color2hwbString(this.color);
	}

	toRGB() {
		return color2rgbString(this.color);
	}

	toRGBLegacy() {
		return color2rgbLegacyString(this.color);
	}

	toString() {
		return color2string(this.color);
	}
}

/* Blending
/* ========================================================================== */

function blend(base, color, percentage, colorspace, isBlendingAlpha) { // eslint-disable-line max-params
	const addition    = number(percentage).div(100);
	const subtraction = number(1).minus(addition);

	if (colorspace === 'hsl') {
		const { hue: h1, saturation: s1, lightness: l1, alpha: a1 } = color2hsl(base);
		const { hue: h2, saturation: s2, lightness: l2, alpha: a2 } = color2hsl(color);

		const [hue, saturation, lightness, alpha] = [
			Number(number(h1).times(subtraction).plus(number(h2).times(addition))),
			Number(number(s1).times(subtraction).plus(number(s2).times(addition))),
			Number(number(l1).times(subtraction).plus(number(l2).times(addition))),
			isBlendingAlpha
				? Number(number(a1).times(subtraction).plus(number(a2).times(addition)))
			: a1
		];

		return { hue, saturation, lightness, alpha, colorspace: 'hsl' };
	} else if (colorspace === 'hwb') {
		const { hue: h1, whiteness: w1, blackness: b1, alpha: a1 } = color2hwb(base);
		const { hue: h2, whiteness: w2, blackness: b2, alpha: a2 } = color2hwb(color);

		const [hue, whiteness, blackness, alpha] = [
			Number(number(h1).times(subtraction).plus(number(h2).times(addition))),
			Number(number(w1).times(subtraction).plus(number(w2).times(addition))),
			Number(number(b1).times(subtraction).plus(number(b2).times(addition))),
			isBlendingAlpha ? Number(number(a1).times(subtraction).plus(number(a2).times(addition))) : a1
		];

		return { hue, whiteness, blackness, alpha, colorspace: 'hwb' };
	} else {
		const { red: r1, green: g1, blue: b1, alpha: a1 } = color2rgb(base);
		const { red: r2, green: g2, blue: b2, alpha: a2 } = color2rgb(color);

		const [red, green, blue, alpha] = [
			Number(number(r1).times(subtraction).plus(number(r2).times(addition))),
			Number(number(g1).times(subtraction).plus(number(g2).times(addition))),
			Number(number(b1).times(subtraction).plus(number(b2).times(addition))),
			isBlendingAlpha ? Number(number(a1).times(subtraction).plus(number(a2).times(addition))) : a1
		];

		return { red, green, blue, alpha, colorspace: 'rgb' };
	}
}

/* Assign channels to a new instance of a base color
/* ========================================================================== */

function assign(base, channels) {
	const color = Object.assign({}, base);

	Object.keys(channels).forEach(
		channel => {
			// detect channel
			const isHue = channel === 'hue';
			const isRGB = !isHue && blueGreenRedMatch.test(channel);

			// normalized value of the channel
			const value = normalize(channels[channel], channel);

			// assign channel to new object
			color[channel] = value;

			if (isRGB) {
				// conditionally preserve the hue
				color.hue = rgb2hue(color.red, color.green, color.blue, base.hue || 0);
			}
		}
	);

	return color;
}

function normalize(value, channel) {
	// detect channel
	const isHue = channel === 'hue';

	// value limitations
	const min = 0;
	const max = isHue ? 360 : 100;

	const modifiedValue = Math.min(Math.max(isHue
		? number(value).mod(360)
	: value, min), max);

	return modifiedValue
}

/* Convert colors
/* ========================================================================== */

function color2hsl(color) {
	return color.colorspace === 'rgb'
		? rgb2hsl(color, color.hue)
	: color.colorspace === 'hwb'
		? rgb2hsl(hwb2rgb(color), color.hue)
	: color;
}

function color2hwb(color) {
	return color.colorspace === 'rgb'
		? rgb2hwb(color, color.hue)
	: color.colorspace === 'hsl'
		? rgb2hwb(hsl2rgb(color), color.hue)
	: color;
}

function color2rgb(color) {
	return color.colorspace === 'hsl'
		? hsl2rgb(color)
	: color.colorspace === 'hwb'
		? hwb2rgb(color)
	: color;
}

/* Convert HSL to RGB
/* ========================================================================== */

function hsl2rgb({ hue, saturation, lightness, alpha = 100 }) {
	const t2 = lightness <= 50
		? Number(
			number(lightness).div(100).times(
				number(saturation).div(100).plus(1)
			)
		)
	: Number(
		number(lightness).div(100).plus(
			number(saturation).div(100)
		).minus(
			number(lightness).div(100).times(
				number(saturation).div(100)
			)
		)
	);

	const t1 = Number(number(lightness).div(100).times(2).minus(t2));

	const red   = hue2channel(t1, t2, Number(number(hue).div(60).plus(2)));
	const green = hue2channel(t1, t2, Number(number(hue).div(60)));
	const blue  = hue2channel(t1, t2, Number(number(hue).div(60).minus(2)));

	return { hue, red, green, blue, alpha, colorspace: 'rgb' };
}

/* Convert HWB to RGB
/* ========================================================================== */

function hwb2rgb({ hue, whiteness, blackness, alpha = 100 }) {
	const ratio = Number(number(whiteness).plus(blackness));
	const rwhiteness = ratio > 100 ? Number(number(whiteness).div(ratio)) : whiteness;
	const rblackness = ratio > 100 ? Number(number(blackness).div(ratio)) : blackness;
	const value = Number(number(100).minus(rblackness));
	const hexagon = number(6).times(hue).div(360);

	const hexagonFloor = Math.floor(hexagon);

	const hexagonF = hexagonFloor % 6
		? number(1).minus(
			hexagon.minus(hexagonFloor)
		)
	: hexagon.minus(hexagonFloor);

	const interpolation = Number(number(rwhiteness).plus(
		hexagonF.times(
			number(value).minus(rwhiteness)
		)
	));

	const [red, green, blue] = hexagonFloor % 6 === 5
		? [value, rwhiteness, interpolation]
	: hexagonFloor % 6 === 4
		? [interpolation, rwhiteness, value]
	: hexagonFloor % 6 === 3
		? [rwhiteness, interpolation, value]
	: hexagonFloor % 6 === 2
		? [rwhiteness, value, interpolation]
	: hexagonFloor % 6 === 1
		? [interpolation, value, rwhiteness]
	: [value, interpolation, rwhiteness];

	return { hue, red, green, blue, alpha, colorspace: 'rgb' };
}

/* Convert RGB to HSL
/* ========================================================================== */

function rgb2hsl({ red, green, blue, alpha = 100 }, fallback = 0) { // eslint-disable-line max-params
	const hue        = rgb2hue(red, green, blue, fallback);
	const whiteness  = rgb2whiteness(red, green, blue);
	const value      = rgb2value(red, green, blue);
	const lightness  = wv2lightness(whiteness, value);
	const saturation = lvw2saturation(lightness, value, whiteness);

	return { hue, saturation, lightness, alpha, colorspace: 'hsl' };
}

/* Convert RGB to HWB
/* ========================================================================== */

function rgb2hwb({ red, green, blue, alpha = 100 }, fallback = 0) { // eslint-disable-line max-params
	const hue       = rgb2hue(red, green, blue, fallback);
	const whiteness = rgb2whiteness(red, green, blue);
	const value     = rgb2value(red, green, blue);
	const blackness = Number(number(100).minus(value));

	return { hue, whiteness, blackness, alpha, colorspace: 'hwb' };
}

/* Convert Hue to RGB
/* ========================================================================== */

function hue2channel(t1, t2, hue) {
	const huerange = hue < 0
		? number(hue).plus(6)
	: hue >= 6
		? number(hue).minus(6)
	: number(hue);

	const rgb = huerange < 1
		? Number(number(number(t2).minus(t1)).times(hue).plus(t1))
	: hue < 3
		? t2
	: hue < 4
		? Number(number(number(t2).minus(t1)).times(number(4).minus(hue)).plus(t1))
	: t1;

	return Number(number(rgb).times(100));
}

/* Convert RGB to Hue
/* ========================================================================== */

function rgb2hue(red, green, blue, fallback) { // eslint-disable-line max-params
	const whiteness = rgb2whiteness(red, green, blue);
	const value     = rgb2value(red, green, blue);
	const chroma    = vw2chroma(value, whiteness);

	if (chroma === 0) {
		return fallback;
	} else {
		const segment = value === red
			? number(green).minus(blue).div(chroma)
		: value === green
			? number(blue).minus(red).div(chroma)
		: number(red).minus(green).div(chroma);

		const shift = value === red
			? segment < 0
				? 360 / 60
				: 0 / 60
		: value === green
			? 120 / 60
		: 240 / 60;

		const hue = Number(number(segment).plus(shift).times(60));

		return hue;
	}
}

/* Contrast functions
/* ========================================================================== */

function contrast(color, percentage) {
	// https://drafts.csswg.org/css-color/#contrast-adjuster
	const hwb = color2hwb(color);

	// compute the luminance of the color.
	const luminance = rgb2luminance(color.red, color.green, color.blue);

	// the maximum-contrast color, if it is less than .5
	const maxContrastColor = luminance < 0.5
		// hwb(X, 100%, 0%), where X is the hue angle of the color
		? { hue: hwb.hue, whiteness: 100, blackness: 0, alpha: hwb.alpha, colorspace: 'hwb' }
	// otherwise, hwb(X, 0%, 100%), where X is the hue angle of the color
	: { hue: hwb.hue, whiteness: 0, blackness: 100, alpha: hwb.alpha, colorspace: 'hwb' };

	// contrast ratio
	const contrastRatio = colors2contrast(color, maxContrastColor);

	const minContrastColor = contrastRatio > 4.5
		// the color with the smallest contrast ratio with the base color that is greater than 4.5
		? colors2contrastRatioColor(hwb, maxContrastColor)
	// otherwise, the maximum-contrast color
	: maxContrastColor;

	// color(maximum-contrast blend(minimum-contrast <percentage> hwb))
	return blend(maxContrastColor, minContrastColor, percentage, 'hwb', false);
}

function colors2contrast(color1, color2) {
	// https://drafts.csswg.org/css-color/#contrast-ratio
	const rgb1 = color2rgb(color1);
	const rgb2 = color2rgb(color2);
	var l1 = rgb2luminance(rgb1.red, rgb1.green, rgb1.blue);
	var l2 = rgb2luminance(rgb2.red, rgb2.green, rgb2.blue);

	return l1 > l2
		// if l1 is the relative luminance of the lighter of the colors
		? Number(number(l1).plus(0.05).div(number(l2).plus(0.05)))
	// otherwise, if l2 is the relative luminance of the lighter of the colors
	: Number(number(l2).plus(0.05).div(number(l2).plus(0.05)));
}

function rgb2luminance(red, green, blue) {
	const [ redLuminance, greenLuminance, blueLuminance ] = [
		channel2luminance(red),
		channel2luminance(green),
		channel2luminance(blue)
	];

	// https://drafts.csswg.org/css-color/#luminance
	const luminance = Number(number(0.2126).times(redLuminance).plus(number(0.7152).times(greenLuminance)).plus(number(0.0722).times(blueLuminance)));

	return luminance;
}

function channel2luminance(value) {
	// https://drafts.csswg.org/css-color/#luminance
	const luminance = value <= 0.03928 ? Number(number(value).div(12.92)) : Math.pow(number(value).plus(0.055).div(1.055), 2.4);

	return luminance;
}

// return the smallest contrast ratio from a color and a maximum contrast (credit: @thetalecrafter)
function colors2contrastRatioColor(hwb, maxHWB) {
	const modifiedHWB = Object.assign({}, hwb);

	// values to be used for linear interpolations in HWB space
	let minW = number(hwb.whiteness);
	let minB = number(hwb.blackness);
	let maxW = number(maxHWB.whiteness);
	let maxB = number(maxHWB.blackness);

	// find the color with the smallest contrast ratio with the base color that is greater than 4.5
	while (Number(minW.minus(maxW).abs()) > 100 || Number(minB.minus(maxB).abs()) > 100) {
		const midW = maxW.plus(minW).div(2).round();
		const midB = maxB.plus(minB).div(2).round();

		modifiedHWB.whiteness = Number(midW);
		modifiedHWB.blackness = Number(midB);

		if (colors2contrast(modifiedHWB, hwb) > 4.5) {
			maxW = midW;
			maxB = midB;
		} else {
			minW = midW;
			minB = midB;
		}
	}

	return modifiedHWB;
}

/* Convert RGB to Whiteness
/* ========================================================================== */

function rgb2whiteness(red, green, blue) {
	return Math.min(red, green, blue);
}

/* Convert RGB to Value
/* ========================================================================== */

function rgb2value(red, green, blue) {
	return Math.max(red, green, blue)
}

/* Convert Whiteness and Value to Lightness
/* ========================================================================== */

function wv2lightness(whiteness, value) {
	return Number(number(whiteness).plus(value).div(2));
}

/* Convert Value and Whiteness to Chroma
/* ========================================================================== */

function vw2chroma(value, whiteness) {
	return Number(number(value).minus(whiteness));
}

/* Convert Lightness, Value, and Whiteness to Saturation
/* ========================================================================== */

function lvw2saturation(lightness, value, whiteness) {
	return whiteness === value
		? 0
	: lightness < 50
		? Number(number(value).minus(whiteness).div(number(value).plus(whiteness)).times(100))
	: Number(number(value).minus(whiteness).div(number(200).minus(value).minus(whiteness)).times(100));
}

/* Match
/* ========================================================================== */

const blueGreenRedMatch = /^(blue|green|red)$/i;

/* Stringifiers
/* ========================================================================== */

function color2string(color) {
	return color.colorspace === 'hsl'
		? color2hslString(color)
	: color.colorspace === 'hwb'
		? color2hwbString(color)
	: color2rgbString(color);
}

function color2hslString(color) {
	const hsl        = color2hsl(color);
	const isOpaque   = hsl.alpha === 100;
	const hue        = hsl.hue;
	const saturation = number(hsl.saturation).round(10);
	const lightness  = number(hsl.lightness).round(10);
	const alpha      = number(hsl.alpha).round(10);

	return `hsl(${hue} ${saturation}% ${lightness}%${isOpaque
		? ''
	: ` / ${alpha}%`})`;
}

function color2hwbString(color) {
	const hwb       = color2hwb(color);
	const isOpaque  = hwb.alpha === 100;
	const hue       = hwb.hue;
	const whiteness = number(hwb.whiteness).round(10);
	const blackness = number(hwb.blackness).round(10);
	const alpha     = number(hwb.alpha).round(10);

	return `hwb(${hue} ${whiteness}% ${blackness}%${isOpaque
		? ''
	: ` / ${alpha}%`})`;
}

function color2rgbString(color) {
	const rgb      = color2rgb(color);
	const isOpaque = rgb.alpha === 100;
	const red      = number(rgb.red).round(10);
	const green    = number(rgb.green).round(10);
	const blue     = number(rgb.blue).round(10);
	const alpha    = number(rgb.alpha).round(10);

	return `rgb(${red}% ${green}% ${blue}%${isOpaque
		? ''
	: ` / ${alpha}%`})`;
}

function color2rgbLegacyString(color) {
	const rgb      = color2rgb(color);
	const isOpaque = rgb.alpha === 100;
	const name     = isOpaque ? 'rgb' : 'rgba';
	const red      = number(rgb.red).times(2.55).round(0);
	const green    = number(rgb.green).times(2.55).round(0);
	const blue     = number(rgb.blue).times(2.55).round(0);
	const alpha    = number(rgb.alpha).div(100).round(10);

	return `${name}(${red}, ${green}, ${blue}${isOpaque
		? ''
	: `, ${alpha}`})`;
}
