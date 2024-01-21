import type { Color } from '../types/color';

export function inGamut(x: Color): boolean {
	const [xX, xY, xZ] = x;
	return xX >= -0.0001 && xX <= 1.0001 && xY >= -0.0001 && xY <= 1.0001 && xZ >= -0.0001 && xZ <= 1.0001;
}
