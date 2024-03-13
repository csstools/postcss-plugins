export const convert_px: Map<string, (number: number) => number> = new Map([
	[
		'cm',
		(x: number): number => {
			return (x / 96) * 2.54;
		},
	],
	[
		'mm',
		(x: number): number => {
			return (x / 96) * 25.4;
		},
	],
	[
		'q',
		(x: number): number => {
			return ((x / 96) * 25.4) * 4;
		},
	],
	[
		'in',
		(x: number): number => {
			return x / 96;
		},
	],
	[
		'pc',
		(x: number): number => {
			return (x / 96) * 6;
		},
	],
	[
		'pt',
		(x: number): number => {
			return (x / 96) * 72;
		},
	],
	[
		'px',
		(x: number): number => {
			return x;
		},
	],
]);
