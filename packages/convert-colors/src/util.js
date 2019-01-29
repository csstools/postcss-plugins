/**
* @private
* @func rgb2hue
* @desc Return a hue angle from an RGB color
* @param {Number} r - Red (0 - 100)
* @param {Number} g - Red (0 - 100)
* @param {Number} b - Red (0 - 100)
* @param {Number} f - Hue Fallback (0 - 360)
* @return {Number} Hue Angle (0 - 360)
* @example
* rgb2hue(100, 0, 0)
* @example
* rgb2hue(100, 0, 0, 0)
*/

export function rgb2hue(rgbR, rgbG, rgbB, fallbackhue = 0) {
	const value     = rgb2value(rgbR, rgbG, rgbB);
	const whiteness = rgb2whiteness(rgbR, rgbG, rgbB);
	const delta     = value - whiteness;

	if (delta) {
		// calculate segment
		const segment = value === rgbR
			? (rgbG - rgbB) / delta
		: value === rgbG
			? (rgbB - rgbR) / delta
		: (rgbR - rgbG) / delta;

		// calculate shift
		const shift = value === rgbR
			? segment < 0
				? 360 / 60
				: 0 / 60
		: value === rgbG
			? 120 / 60
		: 240 / 60;

		// calculate hue
		const hue = (segment + shift) * 60;

		return hue;
	} else {
		// otherwise return the Hue Fallback
		return fallbackhue;
	}
}

/**
* @private
* @func hue2rgb
* @desc Return an RGB channel from a hue angle
* @param {Number} t1
* @param {Number} t2
* @param {Number} h - Hue Angle (0 - 360)
* @return {Number} RGB channel (0 - 100)
* @example
* hue2rgb(0, 0, 0)
*/

export function hue2rgb(t1, t2, hue) {
	// calculate the ranged hue
	const rhue = hue < 0 ? hue + 360 : hue > 360 ? hue - 360 : hue;

	// calculate the rgb value
	const rgb = rhue * 6 < 360
		? t1 + (t2 - t1) * rhue / 60
	: rhue * 2 < 360
		? t2
	: rhue * 3 < 720
		? t1 + (t2 - t1) * (240 - rhue) / 60
	: t1;

	return rgb;
}

/**
* @private
* @func luminance2contrast
* @desc Return the contrast ratio between 2 luminance.
* @param {Number} l1 - Relative luminance of one color
* @param {Number} l2 - Relative luminance of another color
* @return {Number} Contrast ratio between the 2 luminance
* @example
* luminance2contrast(0.2126, 0) // => 5.252
* @link https://www.w3.org/TR/WCAG21/#dfn-contrast-ratio
*/

export function luminance2contrast(relativeLuminance1, relativeLuminance2) {
	// l1 is the relative luminance of the lighter of the colors
	const l1 = max(relativeLuminance1, relativeLuminance2);

	// l1 is the relative luminance of the darker of the colors
	const l2 = min(relativeLuminance1, relativeLuminance2);

	return (l1 * precision + 0.05 * precision) / (l2 * precision + 0.05 * precision);
}


/* RGB tooling
/* ========================================================================== */

export function rgb2value(rgbR, rgbG, rgbB) {
	const value = max(rgbR, rgbG, rgbB);

	return value;
}

export function rgb2whiteness(rgbR, rgbG, rgbB) {
	const whiteness = min(rgbR, rgbG, rgbB);

	return whiteness;
}

/* Math matrix
/* ========================================================================== */

export function matrix(params, mats) {
	return mats.map(
		mat => mat.reduce(
			// (acc, value, index) => acc + params[index] * value,
			(acc, value, index) => acc + params[index] * precision * (value * precision) / precision / precision,
			0
		)
	);
}

/* Precision
/* ========================================================================== */

export const precision = 100000000;

/* D50 reference white
/* ========================================================================== */

export const [ wd50X, wd50Y, wd50Z ] = [ 96.42, 100, 82.49 ];

/* Math Expressions
/* ========================================================================== */

export const atan2d = (y, x) => rad2deg(atan2(y, x)); // arc-tangent in degrees
export const cosd = x => cos(deg2rad(x)); // cosine of the specified angle in degrees
export const deg2rad = x => x * PI / 180; // degree to radian
export const rad2deg = x => x * 180 / PI; // radian to degree
export const sind = x => sin(deg2rad(x)); // sine in degrees

/* Math Constants
/* ========================================================================== */

export const abs = Math.abs;
export const atan2 = Math.atan2;
export const cbrt = Math.cbrt;
export const cos = Math.cos;
export const exp = Math.exp;
export const floor = Math.floor;
export const max = Math.max;
export const min = Math.min;
export const PI = Math.PI;
export const pow = Math.pow;
export const sin = Math.sin;
export const sqrt = Math.sqrt;

export const epsilon = pow(6, 3) / pow(29, 3);
export const kappa = pow(29, 3) / pow(3, 3);
