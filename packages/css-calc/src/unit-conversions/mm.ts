export const convert_mm: Map<string, (number: number) => number> = new Map([
	[
		'cm',
		(x: number): number => {
			return x / 10;
		},
	],
	[
		'mm',
		(x: number): number => {
			return x;
		},
	],
	[
		'q',
		(x: number): number => {
			return x * 4;
		},
	],
	[
		'in',
		(x: number): number => {
			return x / 25.4;
		},
	],
	[
		'pc',
		(x: number): number => {
			return (x / 25.4) * 6;
		},
	],
	[
		'pt',
		(x: number): number => {
			return (x / 25.4) * 72;
		},
	],
	[
		'px',
		(x: number): number => {
			return (x / 25.4) * 96;
		},
	],
]);
