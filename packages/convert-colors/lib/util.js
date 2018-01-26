/* Convert between RGB and Hue
/* ========================================================================== */

export function rgb2hue(rgbR, rgbG, rgbB) {
	const value     = rgb2value(rgbR, rgbG, rgbB);
	const whiteness = rgb2whiteness(rgbR, rgbG, rgbB);
	const delta = value - whiteness;

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
	const hue = (segment + shift) * 60 || 0;

	return hue;
}

export function hue2rgb(t1, t2, hue) {
	// calculate ranged hue
	const rhue = hue < 0 ? hue + 360 : hue > 360 ? hue - 360 : hue;

	if (rhue * 6 < 360) {
		return t1 + (t2 - t1) * rhue / 60;
	}

	if (rhue * 2 < 360) {
		return t2;
	}

	if (rhue * 3 < 720) {
		return t1 + (t2 - t1) * (240 - rhue) / 60;
	}

	return t1;
}

/* RGB tooling
/* ========================================================================== */

export function rgb2value(rgbR, rgbG, rgbB) {
	const value = Math.max(rgbR, rgbG, rgbB);

	return value;
}

export function rgb2whiteness(rgbR, rgbG, rgbB) {
	const whiteness = Math.min(rgbR, rgbG, rgbB);

	return whiteness;
}

/* Math matrix
/* ========================================================================== */

export function matrix(params, mats) {
	return mats.map(mat => mat.reduce((acc, value, index) => acc + params[index] * value, 0));
}

/* D50 reference white
/* ========================================================================== */

export const [ wd50X, wd50Y, wd50Z ] = [ 96.42, 100, 82.49 ];

/* Epsilon
/* ========================================================================== */

export const epsilon = Math.pow(6, 3) / Math.pow(29, 3);

/* Kappa
/* ========================================================================== */

export const kappa = Math.pow(29, 3) / Math.pow(3, 3);
