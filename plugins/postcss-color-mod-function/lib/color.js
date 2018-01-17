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
		const shade = { hue: 0, whiteness: 1, blackness: 0, colorspace: 'hwb' };
		const colorspace = 'hwb';

		return percentage === undefined
			? hwb.blackness
		: new Color(blend(hwb, shade, percentage, colorspace));
	}

	tint(percentage) {
		const hwb = color2hwb(this.color);
		const tint = { hue: 0, whiteness: 0, blackness: 1, colorspace: 'hwb' };
		const colorspace = 'hwb';

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
		const color      = color2hsl(this.color);
		const isOpaque   = color.alpha === 1;
		const hue        = color.hue;
		const saturation = round(color.saturation * 100, 4);
		const lightness  = round(color.lightness * 100, 4);
		const alpha      = round(color.alpha * 100, 4);

		return `hsl(${hue} ${saturation}% ${lightness}%${isOpaque
			? ''
		: ` / ${alpha}%`})`;
	}

	toHWB() {
		const color     = color2hwb(this.color);
		const isOpaque  = color.alpha === 1;
		const hue       = color.hue;
		const whiteness = round(color.whiteness * 100, 4);
		const blackness = round(color.blackness * 100, 4);
		const alpha     = round(color.alpha * 100, 4);

		return `hwb(${hue} ${whiteness}% ${blackness}%${isOpaque
			? ''
		: ` / ${alpha}%`})`;
	}

	toRGB() {
		const color    = color2rgb(this.color);
		const isOpaque = color.alpha === 1;
		const red      = round(color.red * 100, 4);
		const green    = round(color.green * 100, 4);
		const blue     = round(color.blue * 100, 4);
		const alpha    = round(color.alpha * 100, 4);

		return `rgb(${red}% ${green}% ${blue}%${isOpaque
			? ''
		: ` / ${alpha}%`})`;
	}

	toRGBLegacy() {
		const color    = color2rgb(this.color);
		const isOpaque = color.alpha === 1;
		const name     = isOpaque ? 'rgb' : 'rgba';
		const red      = round(color.red * 255, 0);
		const green    = round(color.green * 255, 0);
		const blue     = round(color.blue * 255, 0);
		const alpha    = round(color.alpha, 4);

		return `${name}(${red}, ${green}, ${blue}${isOpaque
			? ''
		: `, ${alpha}`})`;
	}

	toString(rawcolorspace) {
		const colorspace = rawcolorspace || this.color.colorspace;

		const color = colorspace === 'hsl'
			? this.toHSL()
		: colorspace === 'hwb'
			? this.toHWB()
		: this.toRGB();

		return color;
	}
}

/* Blending
/* ========================================================================== */

function blend(base, color, percentage, colorspace, isBlendingAlpha) { // eslint-disable-line max-params
	const subtraction = 1 - percentage;

	if (colorspace === 'hsl') {
		const { hue: h1, saturation: s1, lightness: l1, alpha: a1 } = color2hsl(base);
		const { hue: h2, saturation: s2, lightness: l2, alpha: a2 } = color2hsl(color);

		const [hue, saturation, lightness, alpha] = [
			h1 * percentage + h2 * subtraction,
			s1 * percentage + s2 * subtraction,
			l1 * percentage + l2 * subtraction,
			isBlendingAlpha ? a1 * percentage + a2 * subtraction : a1
		];

		return { hue, saturation, lightness, alpha, colorspace: 'hsl' };
	} else if (colorspace === 'hwb') {
		const { hue: h1, whiteness: w1, blackness: b1, alpha: a1 } = color2hwb(base);
		const { hue: h2, whiteness: w2, blackness: b2, alpha: a2 } = color2hwb(color);

		const [hue, whiteness, blackness, alpha] = [
			h1 * percentage + h2 * subtraction,
			w1 * percentage + w2 * subtraction,
			b1 * percentage + b2 * subtraction,
			isBlendingAlpha ? a1 * percentage + a2 * subtraction : a1
		];

		return { hue, whiteness, blackness, alpha, colorspace: 'hwb' };
	} else {
		const { red: r1, green: g1, blue: b1, alpha: a1 } = color2rgb(base);
		const { red: r2, green: g2, blue: b2, alpha: a2 } = color2rgb(color);

		const [red, green, blue, alpha] = [
			r1 * percentage + r2 * subtraction,
			g1 * percentage + g2 * subtraction,
			b1 * percentage + b2 * subtraction,
			isBlendingAlpha ? a1 * percentage + a2 * subtraction : a1
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

			// value of the channel
			const adjustment = channels[channel];

			// value limitations
			const min = 0;
			const max = isHue ? 360 : 1;

			// updated value
			const value = Math.min(Math.max(parseFloat(adjustment), min), max);

			// assign channel to new object
			if (isHue) {
				color.hue = value;
			} else {
				color[channel] = value;

				color.hue = isRGB
					? rgb2hue(color.red, color.green, color.blue, base.hue || 0)
				: base.hue;
			}
		}
	);

	return color;
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

function hsl2rgb({ hue, saturation, lightness, alpha = 1 }) {
	const t2 = lightness <= 0.5
		? lightness * (saturation + 1)
	: lightness + saturation - lightness * saturation;

	const t1 = lightness * 2 - t2;

	const red   = hue2rgb(t1, t2, hue / 60 + 2);
	const green = hue2rgb(t1, t2, hue / 60);
	const blue  = hue2rgb(t1, t2, hue / 60 - 2);

	return { hue, red, green, blue, alpha, colorspace: 'rgb' };
}

/* Convert HWB to RGB
/* ========================================================================== */

function hwb2rgb({ hue, whiteness, blackness, alpha = 1 }) {
	const ratio = whiteness + blackness;
	const rwhiteness = ratio > 1 ? whiteness / ratio : whiteness;
	const rblackness = ratio > 1 ? blackness / ratio : blackness;

	const value = 1 - rblackness;
	const hexagon = 6 * hue / 360;
	const hexagonFloor = Math.floor(hexagon);
	const hexagonF = hexagonFloor % 6 ? 1 - (hexagon - hexagonFloor) : hexagon - hexagonFloor;
	const interpolation = rwhiteness + hexagonF * (value - rwhiteness);

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

function rgb2hsl({ red, green, blue, alpha = 1 }, fallback = 0) { // eslint-disable-line max-params
	const hue        = rgb2hue(red, green, blue, fallback);
	const whiteness  = rgb2whiteness(red, green, blue);
	const value      = rgb2value(red, green, blue);
	const lightness   = wv2lightness(whiteness, value);
	const saturation = lvw2saturation(lightness, value, whiteness);

	return { hue, saturation, lightness, alpha, colorspace: 'hsl' };
}

/* Convert RGB to HWB
/* ========================================================================== */

function rgb2hwb({ red, green, blue, alpha = 1 }, fallback = 0) { // eslint-disable-line max-params
	const hue       = rgb2hue(red, green, blue, fallback);
	const whiteness = rgb2whiteness(red, green, blue);
	const value     = rgb2value(red, green, blue);
	const blackness = 1 - value;

	return { hue, whiteness, blackness, alpha, colorspace: 'hwb' };
}

/* Convert Hue to RGB
/* ========================================================================== */

function hue2rgb(t1, t2, hue) {
	const huerange = hue < 0 ? hue + 6 : hue >= 6 ? hue - 6 : hue;

	const rgb = huerange < 1
		? (t2 - t1) * hue + t1
	: hue < 3
		? t2
	: hue < 4
		? (t2 - t1) * (4 - hue) + t1
	: t1;

	return rgb;
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
	: { hue: hwb.hue, whiteness: 0, blackness: 1, alpha: hwb.alpha, colorspace: 'hwb' };

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
		? (l1 + 0.05) / (l2 + 0.05)
	// otherwise, if l2 is the relative luminance of the lighter of the colors
	: (l2 + 0.05) / (l2 + 0.05);
}

function rgb2luminance(red, green, blue) {
	const [ redLuminance, greenLuminance, blueLuminance ] = [
		channel2luminance(red),
		channel2luminance(green),
		channel2luminance(blue)
	];

	// https://drafts.csswg.org/css-color/#luminance
	return 0.2126 * redLuminance + 0.7152 * greenLuminance + 0.0722 * blueLuminance;
}

function channel2luminance(value) {
	// https://drafts.csswg.org/css-color/#luminance
	return value <= 0.03928 ? value / 12.92 : Math.pow((value + 0.055) / 1.055, 2.4);
}

// return the smallest contrast ratio from a color and a maximum contrast (credit: @thetalecrafter)
function colors2contrastRatioColor(hwb, maxHWB) {
	const modifiedHWB = Object.assign({}, hwb);

	// values to be used for linear interpolations in HWB space
	let minW = hwb.whiteness;
	let minB = hwb.blackness;
	let maxW = maxHWB.whiteness;
	let maxB = maxHWB.blackness;

	// find the color with the smallest contrast ratio with the base color that is greater than 4.5
	while (Math.abs(minW - maxW) > 1 || Math.abs(minB - maxB) > 1) {
		const midW = Math.round((maxW + minW) / 2);
		const midB = Math.round((maxB + minB) / 2);

		modifiedHWB.whiteness = midW;
		modifiedHWB.blackness = midB;

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
	return (whiteness + value) / 2;
}

/* Convert Value and Whiteness to Chroma
/* ========================================================================== */

function vw2chroma(value, whiteness) {
	return value - whiteness;
}

/* Convert Lightness, Value, and Whiteness to Saturation
/* ========================================================================== */

function lvw2saturation(lightness, value, whiteness) {
	return whiteness === value
		? 0
	: lightness < 0.5
		? (value - whiteness) / (value + whiteness)
	: (value - whiteness) / (2 - value - whiteness);
}

/* Round to decimal place
/* ========================================================================== */

function round(value, decimals) {
	return Number(`${Math.round(`${value}e${decimals}`)}e-${decimals}`);
}

/* Match
/* ========================================================================== */

const blueGreenRedMatch = /^(blue|green|red)$/i;
