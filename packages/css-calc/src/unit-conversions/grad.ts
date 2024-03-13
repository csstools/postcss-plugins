export const convert_grad: Map<string, (number: number) => number> = new Map([
	[
		'deg',
		(x: number): number => {
			return x * 0.9;
		},
	],
	[
		'grad',
		(x: number): number => {
			return x;
		},
	],
	[
		'rad',
		(x: number): number => {
			return (x * 0.9) / 180 * (Math.PI);
		},
	],
	[
		'turn',
		(x: number): number => {
			return (x * 0.9) / 360;
		},
	],
]);
