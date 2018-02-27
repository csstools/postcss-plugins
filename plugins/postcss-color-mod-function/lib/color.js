import { rgb2hsl, rgb2hwb, hsl2rgb, hsl2hwb, hwb2rgb, hwb2hsl, rgb2hue } from '@csstools/convert-colors';

export default class Color {
	constructor(color) {
		this.color = Object(Object(color).color || color);

		this.color.colorspace = this.color.colorspace
			? this.color.colorspace
		: 'red' in color && 'green' in color && 'blue' in color
			? 'rgb'
		: 'hue' in color && 'saturation' in color && 'lightness' in color
			? 'hsl'
		: 'hue' in color && 'whiteness' in color && 'blackness' in color
			? 'hwb'
		: 'unknown';

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

	toLegacy() {
		return color2legacyString(this.color);
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

function blend(base, color, percentage, colorspace, isBlendingAlpha) {
	const addition    = percentage / 100;
	const subtraction = 1 - addition;

	if (colorspace === 'hsl') {
		const { hue: h1, saturation: s1, lightness: l1, alpha: a1 } = color2hsl(base);
		const { hue: h2, saturation: s2, lightness: l2, alpha: a2 } = color2hsl(color);

		const [hue, saturation, lightness, alpha] = [
			h1 * subtraction + h2 * addition,
			s1 * subtraction + s2 * addition,
			l1 * subtraction + l2 * addition,
			isBlendingAlpha
				? a1 * subtraction + a2 * addition
			: a1
		];

		return { hue, saturation, lightness, alpha, colorspace: 'hsl' };
	} else if (colorspace === 'hwb') {
		const { hue: h1, whiteness: w1, blackness: b1, alpha: a1 } = color2hwb(base);
		const { hue: h2, whiteness: w2, blackness: b2, alpha: a2 } = color2hwb(color);

		const [hue, whiteness, blackness, alpha] = [
			h1 * subtraction + h2 * addition,
			w1 * subtraction + w2 * addition,
			b1 * subtraction + b2 * addition,
			isBlendingAlpha
				? a1 * subtraction + a2 * addition
			: a1
		];

		return { hue, whiteness, blackness, alpha, colorspace: 'hwb' };
	} else {
		const { red: r1, green: g1, blue: b1, alpha: a1 } = color2rgb(base);
		const { red: r2, green: g2, blue: b2, alpha: a2 } = color2rgb(color);

		const [red, green, blue, alpha] = [
			r1 * subtraction + r2 * addition,
			g1 * subtraction + g2 * addition,
			b1 * subtraction + b2 * addition,
			isBlendingAlpha
				? a1 * subtraction + a2 * addition
			: a1
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

	const normalizedValue = Math.min(Math.max(isHue
		? value % 360
	: value, min), max);

	return normalizedValue;
}

/* Convert colors
/* ========================================================================== */

function color2rgb(color) {
	const [ red, green, blue ] = color.colorspace === 'hsl'
		? hsl2rgb(color.hue, color.saturation, color.lightness)
	: color.colorspace === 'hwb'
		? hwb2rgb(color.hue, color.whiteness, color.blackness)
	: [ color.red, color.green, color.blue ];

	return { red, green, blue, hue: color.hue, alpha: color.alpha, colorspace: 'rgb' };
}

function color2hsl(color) {
	const [ hue, saturation, lightness ] = color.colorspace === 'rgb'
		? rgb2hsl(color.red, color.green, color.blue, color.hue)
	: color.colorspace === 'hwb'
		? hwb2hsl(color.hue, color.whiteness, color.blackness)
	: [ color.hue, color.saturation, color.lightness ];

	return { hue, saturation, lightness, alpha: color.alpha, colorspace: 'hsl' };
}

function color2hwb(color) {
	const [ hue, whiteness, blackness ] = color.colorspace === 'rgb'
		? rgb2hwb(color.red, color.green, color.blue, color.hue)
	: color.colorspace === 'hsl'
		? hsl2hwb(color.hue, color.saturation, color.lightness)
	: [ color.hue, color.whiteness, color.blackness ];

	return { hue, whiteness, blackness, alpha: color.alpha, colorspace: 'hwb' };
}

/* Contrast functions
/* ========================================================================== */

function contrast(color, percentage) {
	// https://drafts.csswg.org/css-color/#contrast-adjuster
	const hwb = color2hwb(color);
	const rgb = color2rgb(color);

	// compute the luminance of the color.
	const luminance = rgb2luminance(rgb.red, rgb.green, rgb.blue);

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

	// color(maximum-contrast blend(minimum-contrast <percentage> hwb)));
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
	: (l2 + 0.05) / (l1 + 0.05);
}

function rgb2luminance(red, green, blue) {
	const [ redLuminance, greenLuminance, blueLuminance ] = [
		channel2luminance(red),
		channel2luminance(green),
		channel2luminance(blue)
	];

	// https://drafts.csswg.org/css-color/#luminance
	const luminance = 0.2126 * redLuminance + 0.7152 * greenLuminance + 0.0722 * blueLuminance;

	return luminance;
}

function channel2luminance(value) {
	// https://drafts.csswg.org/css-color/#luminance
	const luminance = value <= 0.03928 ? value / 12.92 : Math.pow((value + 0.055) /1.055, 2.4);

	return luminance;
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
	while (Math.abs(minW - maxW) > 100 || Math.abs(minB - maxB) > 100) {
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
	const saturation = Math.round(hsl.saturation * 10000000000) / 10000000000;
	const lightness  = Math.round(hsl.lightness * 10000000000) / 10000000000;
	const alpha      = Math.round(hsl.alpha * 10000000000) / 10000000000;

	return `hsl(${hue} ${saturation}% ${lightness}%${isOpaque
		? ''
	: ` / ${alpha}%`})`;
}

function color2hwbString(color) {
	const hwb       = color2hwb(color);
	const isOpaque  = hwb.alpha === 100;
	const hue       = hwb.hue;
	const whiteness = Math.round(hwb.whiteness * 10000000000) / 10000000000;
	const blackness = Math.round(hwb.blackness * 10000000000) / 10000000000;
	const alpha     = Math.round(hwb.alpha * 10000000000) / 10000000000;

	return `hwb(${hue} ${whiteness}% ${blackness}%${isOpaque
		? ''
	: ` / ${alpha}%`})`;
}

function color2rgbString(color) {
	const rgb      = color2rgb(color);
	const isOpaque = rgb.alpha === 100;
	const red      = Math.round(rgb.red * 10000000000) / 10000000000;
	const green    = Math.round(rgb.green * 10000000000) / 10000000000;
	const blue     = Math.round(rgb.blue * 10000000000) / 10000000000;
	const alpha    = Math.round(rgb.alpha * 10000000000) / 10000000000;

	return `rgb(${red}% ${green}% ${blue}%${isOpaque
		? ''
	: ` / ${alpha}%`})`;
}

function color2legacyString(color) {
	return color.colorspace === 'hsl'
		? color2hslLegacyString(color)
	: color2rgbLegacyString(color);
}

function color2rgbLegacyString(color) {
	const rgb      = color2rgb(color);
	const isOpaque = rgb.alpha === 100;
	const name     = isOpaque ? 'rgb' : 'rgba';
	const red      = Math.round(rgb.red * 255 / 100);
	const green    = Math.round(rgb.green * 255 / 100);
	const blue     = Math.round(rgb.blue * 255 / 100);
	const alpha    = Math.round(rgb.alpha / 100 * 10000000000) / 10000000000;

	return `${name}(${red}, ${green}, ${blue}${isOpaque
		? ''
	: `, ${alpha}`})`;
}

function color2hslLegacyString(color) {
	const hsl        = color2hsl(color);
	const isOpaque   = hsl.alpha === 100;
	const name       = isOpaque ? 'hsl' : 'hsla';
	const hue        = hsl.hue;
	const saturation = Math.round(hsl.saturation * 10000000000) / 10000000000;
	const lightness  = Math.round(hsl.lightness * 10000000000) / 10000000000;
	const alpha      = Math.round(hsl.alpha / 100 * 10000000000) / 10000000000;

	return `${name}(${hue}, ${saturation}%, ${lightness}%${isOpaque
		? ''
	: `, ${alpha}`})`;
}
