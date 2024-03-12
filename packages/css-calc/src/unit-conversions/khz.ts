export const convert_khz: Map<string, (number: number) => number> = new Map([
	[
		'hz',
		(x: number): number => {
			return x * 1000;
		},
	],
	[
		'khz',
		(x: number): number => {
			return x;
		},
	],
]);
