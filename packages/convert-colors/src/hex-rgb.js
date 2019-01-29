/**
* @func hex2rgb
* @desc Return an RGBA color from a Hex color.
* @param {StringHex} hex
* @return {ArrayRGBA}
* @example
* hex2rgb("#f00") // => [100, 0, 0, 100]
* hex2rgb("#f00f") // => [100, 0, 0, 100]
* @example
* hex2rgb("#ff0000") // => [100, 0, 0, 100]
* hex2rgb("#ff0000ff") // => [100, 0, 0, 100]
*/

export function hex2rgb(hex) {
	// #<hex-color>{3,4,6,8}
	const [, r, g, b, a, rr, gg, bb, aa] = hex.match(hexColorMatch) || [];

	if (rr !== undefined || r !== undefined) {
		const red   = rr !== undefined ? parseInt(rr, 16) : parseInt(r + r, 16);
		const green = gg !== undefined ? parseInt(gg, 16) : parseInt(g + g, 16);
		const blue  = bb !== undefined ? parseInt(bb, 16) : parseInt(b + b, 16);
		const alpha = aa !== undefined ? parseInt(aa, 16) : a !== undefined ? parseInt(a + a, 16) : 255;

		return [red, green, blue, alpha].map(c => c * 100 / 255);
	}

	return undefined;
}

/**
* @func rgb2hex
* @desc Return a HEX color from an RGB color
* @param {Number} r - Red (0 - 100)
* @param {Number} g - Green (0 - 100)
* @param {Number} b - Blue (0 - 100)
* @return {StringHex}
* @example
* rgb2hex(100, 0, 0) // => "#ff0000"
*/

export function rgb2hex(rgbR, rgbG, rgbB) {
	return `#${((1 << 24) + (Math.round(rgbR * 255 / 100) << 16) + (Math.round(rgbG * 255 / 100) << 8) + Math.round(rgbB * 255 / 100)).toString(16).slice(1)}`;
}

const hexColorMatch = /^#?(?:([a-f0-9])([a-f0-9])([a-f0-9])([a-f0-9])?|([a-f0-9]{2})([a-f0-9]{2})([a-f0-9]{2})([a-f0-9]{2})?)$/i;
