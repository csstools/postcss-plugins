import type { Color } from '../types/color';

export function clip(color: Color): Color {
	return color.map(val => {
		if (val < 0) {
			return 0;
		} else if (val > 1) {
			return 1;
		} else {
			return val;
		}
	}) as Color;
}
