import { Color } from '../types/color';

export type Matrix = [
	number, number, number,
	number, number, number,
	number, number, number,
];

export function multiplyMatrices(a: Matrix, b: Color): Color {
	return [
		a[0] * b[0] + a[1] * b[1] + a[2] * b[2],
		a[3] * b[0] + a[4] * b[1] + a[5] * b[2],
		a[6] * b[0] + a[7] * b[1] + a[8] * b[2],
	];
}
