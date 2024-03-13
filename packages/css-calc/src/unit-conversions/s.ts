export const convert_s: Map<string, (number: number) => number> = new Map([
	[
		'ms',
		(x: number): number => {
			return x * 1000;
		},
	],
	[
		's',
		(x: number): number => {
			return x;
		},
	],
]);
