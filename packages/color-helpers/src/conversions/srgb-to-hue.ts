import type { Color } from "../types/color";

export function sRGB_to_Hue(x: Color): number {
	const red = x[0];
	const green = x[1];
	const blue = x[2];

	const max = Math.max(red, green, blue);
	const min = Math.min(red, green, blue);
	let hue = NaN;
	const d = max - min;

	if (d !== 0) {
		switch (max) {
			case red: hue = ((green - blue) / d); break;
			case green: hue = (blue - red) / d + 2; break;
			case blue: hue = (red - green) / d + 4;
		}

		hue = hue * 60;
	}

	if (hue >= 360) {
		hue -= 360;
	} else if (hue < 0) {
		hue += 360;
	}

	return hue;
}
