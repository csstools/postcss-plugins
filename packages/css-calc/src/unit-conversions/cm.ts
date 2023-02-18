export const convert_cm: Map<string, (number: number) => number> = new Map([
	[
		'cm',
		(x: number) => {
			return x;
		},
	],
	[
		'mm',
		(x: number) => {
			return x * 10;
		},
	],
	[
		'q',
		(x: number) => {
			return x * 40;
		},
	],
	[
		'in',
		(x: number) => {
			return x / 2.54;
		},
	],
	[
		'pc',
		(x: number) => {
			return (x / 2.54) * 6;
		},
	],
	[
		'pt',
		(x: number) => {
			return (x / 2.54) * 72;
		},
	],
	[
		'px',
		(x: number) => {
			return (x / 2.54) * 96;
		},
	],
]);
