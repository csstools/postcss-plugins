export const convert_grad: Map<string, (number) => number> = new Map([
	[
		'deg',
		(x: number) => {
			return x * 0.9;
		},
	],
	[
		'grad',
		(x: number) => {
			return x;
		},
	],
	[
		'rad',
		(x: number) => {
			return (x * 0.9) / 180 * (Math.PI);
		},
	],
	[
		'turn',
		(x: number) => {
			return (x * 0.9) / 360;
		},
	],
]);
