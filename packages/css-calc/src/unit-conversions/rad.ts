export const convert_rad: Map<string, (number: number) => number> = new Map([
	[
		'deg',
		(x: number): number => {
			return x * 180 / (Math.PI);
		},
	],
	[
		'grad',
		(x: number): number => {
			return (x * 180 / (Math.PI)) / 0.9;
		},
	],
	[
		'rad',
		(x: number): number => {
			return x;
		},
	],
	[
		'turn',
		(x: number): number => {
			return (x * 180 / (Math.PI)) / 360;
		},
	],
]);
