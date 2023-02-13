export const convert_turn: Map<string, (number) => number> = new Map([
	[
		'deg',
		(x: number) => {
			return x * 360;
		},
	],
	[
		'grad',
		(x: number) => {
			return (x * 360) / 0.9;
		},
	],
	[
		'rad',
		(x: number) => {
			return (x * 360) / 180 * (Math.PI);
		},
	],
	[
		'turn',
		(x: number) => {
			return x;
		},
	],
]);
