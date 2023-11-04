import { binarySearchGamut } from '../calculations/binary-search-gamut';
import type { Color } from '../types/color';

export function mapGamut(startOKLCH: Color, toDestination: (x: Color) => Color, fromDestination: (x: Color) => Color): Color {
	return binarySearchGamut(startOKLCH, toDestination, fromDestination);
}
