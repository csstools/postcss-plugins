export const convert_pc: Map<string, (number: number) => number> = new Map([
	[
		'cm',
		(x: number): number => {
			return (x / 6) * 2.54;
		},
	],
	[
		'mm',
		(x: number): number => {
			return (x / 6) * 25.4;
		},
	],
	[
		'q',
		(x: number): number => {
			return ((x / 6) * 25.4) * 4;
		},
	],
	[
		'in',
		(x: number): number => {
			return x / 6;
		},
	],
	[
		'pc',
		(x: number): number => {
			return x;
		},
	],
	[
		'pt',
		(x: number): number => {
			return (x / 6) * 72;
		},
	],
	[
		'px',
		(x: number): number => {
			return (x / 6) * 96;
		},
	],
]);
