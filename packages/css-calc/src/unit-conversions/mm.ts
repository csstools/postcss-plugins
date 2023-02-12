export const convert_mm: Map<string, (number) => number> = new Map([
	[
		'cm',
		(x: number) => {
			return x / 10;
		},
	],
	[
		'mm',
		(x: number) => {
			return x;
		},
	],
	[
		'q',
		(x: number) => {
			return x * 4;
		},
	],
	[
		'in',
		(x: number) => {
			return x / 25.4;
		},
	],
	[
		'pc',
		(x: number) => {
			return (x / 25.4) * 6;
		},
	],
	[
		'pt',
		(x: number) => {
			return (x / 25.4) * 72;
		},
	],
	[
		'px',
		(x: number) => {
			return (x / 25.4) * 96;
		},
	],
]);
