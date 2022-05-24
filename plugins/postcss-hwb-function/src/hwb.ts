type color = [number, number, number];

// source: https://github.com/w3c/csswg-drafts/blob/main/css-color-4/hwbToRgb.js
export function hwbToRgb(hwb: color): color {
	const hue = hwb[0];
	let white = hwb[1];
	let black = hwb[2];

	white /= 100;
	black /= 100;
	if (white + black >= 1) {
		const gray = white / (white + black);
		return [gray, gray, gray].map((x) => Math.round(x * 255)) as color;
	}
	const rgb = hslToRgb([hue, 100, 50]);
	for (let i = 0; i < 3; i++) {
		rgb[i] *= (1 - white - black);
		rgb[i] += white;
	}
	return rgb.map((x) => Math.round(x * 255)) as color;
}

// source: https://github.com/w3c/csswg-drafts/blob/main/css-color-4/hslToRgb.js
function hslToRgb(hwb: color): color {
	let hue = hwb[0];
	let sat = hwb[1];
	let light = hwb[2];

	hue = hue % 360;

	if (hue < 0) {
		hue += 360;
	}

	sat /= 100;
	light /= 100;

	function f(n) {
		const k = (n + hue / 30) % 12;
		const a = sat * Math.min(light, 1 - light);
		return light - a * Math.max(-1, Math.min(k - 3, 9 - k, 1));
	}

	return [f(0), f(8), f(4)];
}
