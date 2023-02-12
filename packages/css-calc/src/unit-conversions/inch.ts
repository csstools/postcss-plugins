export const convert_in: Map<string, (number) => number> = new Map([
	[
		'cm',
		(x: number) => {
			return x * 2.54;
		},
	],
	[
		'mm',
		(x: number) => {
			return x * 25.4;
		},
	],
	[
		'q',
		(x: number) => {
			return x * 25.4 * 4;
		},
	],
	[
		'in',
		(x: number) => {
			return x;
		},
	],
	[
		'pc',
		(x: number) => {
			return x * 6;
		},
	],
	[
		'pt',
		(x: number) => {
			return x * 72;
		},
	],
	[
		'px',
		(x: number) => {
			return x * 96;
		},
	],
]);
