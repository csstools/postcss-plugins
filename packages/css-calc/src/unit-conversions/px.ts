export const convert_px: Map<string, (number) => number> = new Map([
	[
		'cm',
		(x: number) => {
			return (x / 96) * 2.54;
		},
	],
	[
		'mm',
		(x: number) => {
			return (x / 96) * 25.4;
		},
	],
	[
		'q',
		(x: number) => {
			return ((x / 96) * 25.4) * 4;
		},
	],
	[
		'in',
		(x: number) => {
			return x / 96;
		},
	],
	[
		'pc',
		(x: number) => {
			return (x / 96) * 6;
		},
	],
	[
		'pt',
		(x: number) => {
			return (x / 96) * 72;
		},
	],
	[
		'px',
		(x: number) => {
			return x;
		},
	],
]);
