export const convert_hz: Map<string, (number: number) => number> = new Map([
	[
		'hz',
		(x: number): number => {
			return x;
		},
	],
	[
		'khz',
		(x: number): number => {
			return x / 1000;
		},
	],
]);
