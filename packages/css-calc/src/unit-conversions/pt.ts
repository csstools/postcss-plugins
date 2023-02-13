export const convert_pt: Map<string, (number) => number> = new Map([
	[
		'cm',
		(x: number) => {
			return (x / 72) * 2.54;
		},
	],
	[
		'mm',
		(x: number) => {
			return (x / 72) * 25.4;
		},
	],
	[
		'q',
		(x: number) => {
			return ((x / 72) * 25.4) * 4;
		},
	],
	[
		'in',
		(x: number) => {
			return x / 72;
		},
	],
	[
		'pc',
		(x: number) => {
			return (x / 72) * 6;
		},
	],
	[
		'pt',
		(x: number) => {
			return x;
		},
	],
	[
		'px',
		(x: number) => {
			return (x / 72) * 96;
		},
	],
]);
