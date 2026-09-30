import type { Color } from '../types/color';

export function clip(color: Color): Color {
	return [
		(color[0] < 0 ? 0 : (color[0] > 1 ? 1 : color[0])),
		(color[1] < 0 ? 0 : (color[1] > 1 ? 1 : color[1])),
		(color[2] < 0 ? 0 : (color[2] > 1 ? 1 : color[2]))
	];
}
