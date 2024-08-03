import type { Color } from '../types/color';

export function inGamut(x: Color): boolean {
	return x[0] >= -0.0001 && x[0] <= 1.0001 && x[1] >= -0.0001 && x[1] <= 1.0001 && x[2] >= -0.0001 && x[2] <= 1.0001;
}
