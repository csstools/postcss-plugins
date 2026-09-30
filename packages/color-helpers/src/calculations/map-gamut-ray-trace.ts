/**
	MIT License

	Copyright (c) 2020 - 2023 Isaac Muse

	Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

	The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

	THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 */

import { clip } from '../utils/clip';
import type { Color } from '../types/color';

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

	// 2. Convert the input color to the closest matching linear RGB space
	let linear = toLinear(startOKLCH);
	// 3. Calculate an achromatic version of the color (in OKLCH) and convert it to the same linear RGB space
	const achromatic = toLinear([lightness, 0, hue]);

	// 4. Perform up to 4 iterations to find the closest color in gamut
	for (let i = 0; i < 4; i++) {
		// 4.1. On subsequent iterations, we correct the lightness and hue
		if (i > 0) {
			// 4.1.1. Convert the current color back to OKLCH
			const oklch = fromLinear(linear);
			// 4.1.2. Correct the lightness and hue
			oklch[0] = lightness;
			oklch[2] = hue;
			// 4.1.3. Convert the corrected color back to linear RGB
			linear = toLinear(oklch);
		}

		// 4.2 Perform a raytrace to find the intersection of the line between the achromatic and the current color
		const intersection = rayTraceBox(achromatic, linear);
		// 4.3 If no intersection is found, we are already in gamut
		if (!intersection) {
			break;
		}

		// 4.4 Assign the intersection to the current color
		linear = intersection;
	}

	// 5. Clip the result to account for floating point errors
	return clip(linear);
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

	// A point, or something approaching a single point where start and end are the same.
	if (!isFinite(tnear)) {
		return false;
	}

	return [
		start[0] + (direction[0] * tnear),
		start[1] + (direction[1] * tnear),
		start[2] + (direction[2] * tnear),
	];
}
