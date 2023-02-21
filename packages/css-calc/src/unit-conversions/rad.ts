export const convert_rad: Map<string, (number: number) => number> = new Map([
	[
		'deg',
		(x: number) => {
			return x * 180 / (Math.PI);
		},
	],
	[
		'grad',
		(x: number) => {
			return (x * 180 / (Math.PI)) / 0.9;
		},
	],
	[
		'rad',
		(x: number) => {
			return x;
		},
	],
	[
		'turn',
		(x: number) => {
			return (x * 180 / (Math.PI)) / 360;
		},
	],
]);
