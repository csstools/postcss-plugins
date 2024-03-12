export const convert_in: Map<string, (number: number) => number> = new Map([
	[
		'cm',
		(x: number): number => {
			return x * 2.54;
		},
	],
	[
		'mm',
		(x: number): number => {
			return x * 25.4;
		},
	],
	[
		'q',
		(x: number): number => {
			return (x * 25.4) * 4;
		},
	],
	[
		'in',
		(x: number): number => {
			return x;
		},
	],
	[
		'pc',
		(x: number): number => {
			return x * 6;
		},
	],
	[
		'pt',
		(x: number): number => {
			return x * 72;
		},
	],
	[
		'px',
		(x: number): number => {
			return x * 96;
		},
	],
]);
