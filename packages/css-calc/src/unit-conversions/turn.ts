export const convert_turn: Map<string, (number: number) => number> = new Map([
	[
		'deg',
		(x: number): number => {
			return x * 360;
		},
	],
	[
		'grad',
		(x: number): number => {
			return (x * 360) / 0.9;
		},
	],
	[
		'rad',
		(x: number): number => {
			return (x * 360) / 180 * (Math.PI);
		},
	],
	[
		'turn',
		(x: number): number => {
			return x;
		},
	],
]);
