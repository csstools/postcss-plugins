export const convert_ms: Map<string, (number: number) => number> = new Map([
	[
		'ms',
		(x: number) => {
			return x;
		},
	],
	[
		's',
		(x: number) => {
			return x / 1000;
		},
	],
]);
