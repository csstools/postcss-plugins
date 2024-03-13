export const convert_cm: Map<string, (number: number) => number> = new Map([
	[
		'cm',
		(x: number): number => {
			return x;
		},
	],
	[
		'mm',
		(x: number): number => {
			return x * 10;
		},
	],
	[
		'q',
		(x: number): number => {
			return x * 40;
		},
	],
	[
		'in',
		(x: number): number => {
			return x / 2.54;
		},
	],
	[
		'pc',
		(x: number): number => {
			return (x / 2.54) * 6;
		},
	],
	[
		'pt',
		(x: number): number => {
			return (x / 2.54) * 72;
		},
	],
	[
		'px',
		(x: number): number => {
			return (x / 2.54) * 96;
		},
	],
]);
