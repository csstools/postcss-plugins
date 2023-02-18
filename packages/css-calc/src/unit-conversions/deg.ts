export const convert_deg: Map<string, (number: number) => number> = new Map([
	[
		'deg',
		(x: number) => {
			return x;
		},
	],
	[
		'grad',
		(x: number) => {
			return x / 0.9;
		},
	],
	[
		'rad',
		(x: number) => {
			return x / 180 * (Math.PI);
		},
	],
	[
		'turn',
		(x: number) => {
			return x / 360;
		},
	],
]);
