export const convert_ms: Map<string, (number: number) => number> = new Map([
	[
		'ms',
		(x: number): number => {
			return x;
		},
	],
	[
		's',
		(x: number): number => {
			return x / 1000;
		},
	],
]);
