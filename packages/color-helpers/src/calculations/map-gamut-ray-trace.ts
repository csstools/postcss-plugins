/**
	MIT License

	Copyright (c) 2020 - 2023 Isaac Muse

	Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

	The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

	THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 */

import { clip } from '../utils/clip';
import type { Color } from '../types/color';

const LOW = 1e-12;
const HIGH = 1 - LOW;

/**
 * @license MIT https://github.com/facelessuser/coloraide/blob/main/LICENSE.md
 */
export function mapGamutRayTrace(
	startOKLCH: Color,
	toLinear: (x: Color) => Color,
	fromLinear: (x: Color) => Color,
): Color {
	// 1. Extract the lightness and hue from the input color
	const lightness = startOKLCH[0];
	const hue = startOKLCH[2];

	// 2. Handle colors at the lightness endpoints.
	if (lightness >= 1) {
		return clip(toLinear([1, 0, 0]));
	}

	if (lightness <= 0) {
		return clip(toLinear([0, 0, 0]));
	}

	// 3. Convert the input color to the closest matching linear RGB space
	let linear = toLinear(startOKLCH);

	// 4. Colors that are already in gamut do not need to be traced.
	if (inLinearGamut(linear)) {
		return clip(linear);
	}

	// 5. Calculate an achromatic version of the color (in OKLCH) and convert it to the same linear RGB space
	let achromatic = toLinear([lightness, 0, hue]);

	// 6. Perform up to 4 iterations to find the closest color in gamut
	let last = linear;
	for (let i = 0; i < 4; i++) {
		// 6.1. On subsequent iterations, we correct the lightness and hue
		if (i > 0) {
			// 6.1.1. Convert the current color back to OKLCH
			const oklch = fromLinear(linear);
			// 6.1.2. Correct the lightness and hue
			oklch[0] = lightness;
			oklch[2] = hue;
			// 6.1.3. Convert the corrected color back to linear RGB
			linear = toLinear(oklch);
		}

		// 6.2. Perform a raytrace to find the intersection of the line between the achromatic and the current color
		const intersection = rayTraceBox(achromatic, linear);

		// 6.3. If no intersection is found, restore the previous intersection
		if (!intersection) {
			linear = last;
			break;
		}

		// 6.4. Move the anchor when the current color is inside the inner box
		if (i > 0 && inInnerBox(linear)) {
			achromatic = linear;
		}

		// 6.5. Assign the intersection to the current color
		linear = intersection;
		last = intersection;
	}

	// 7. Clip the result to account for floating point errors
	return clip(linear);
}

function inLinearGamut(color: Color): boolean {
	return color[0] >= 0 && color[0] <= 1 &&
		color[1] >= 0 && color[1] <= 1 &&
		color[2] >= 0 && color[2] <= 1;
}

function inInnerBox(color: Color): boolean {
	return color[0] >= LOW && color[0] <= HIGH &&
		color[1] >= LOW && color[1] <= HIGH &&
		color[2] >= LOW && color[2] <= HIGH;
}

function rayTraceBox(start: Color, end: Color): Color | false {
	let tfar = Infinity;
	let tnear = -Infinity;

	const direction = [0, 0, 0];

	for (let i = 0; i < 3; i++) {
		const a = start[i];
		const b = end[i];
		const d = b - a;

		direction[i] = d;

		const bn = 0;
		const bx = 1;

		if (Math.abs(d) > 1e-12) {
			const inv_d = 1 / d;
			const t1 = (bn - a) * inv_d;
			const t2 = (bx - a) * inv_d;
			tnear = Math.max(Math.min(t1, t2), tnear);
			tfar = Math.min(Math.max(t1, t2), tfar);
		} else if (a < bn || a > bx) {
			return false;
		}
	}

	if (tnear > tfar || tfar < 0) {
		return false;
	}

	if (tnear < 0) {
		tnear = tfar;
	}

	if (!isFinite(tnear)) {
		return false;
	}

	return [
		start[0] + (direction[0] * tnear),
		start[1] + (direction[1] * tnear),
		start[2] + (direction[2] * tnear),
	];
}
