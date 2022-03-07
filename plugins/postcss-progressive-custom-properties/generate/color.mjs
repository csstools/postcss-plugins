import { matcherForValue } from './matcher-for-value.mjs';

export const colorMatchers = [
	...([
		'srgb',
		'srgb-linear',
		'a98-rgb',
		'prophoto-rgb',
		'display-p3',
		'rec2020',
		'xyz-d50',
		'xyz-d65',
		'xyz',
	].map((colorSpace) => {
		return {
			'supports': `color(${colorSpace} 0 0 0)`,
			'property': 'color',
			'sniff': 'color',
			'matchers': [
				matcherForValue(`color(${colorSpace} $1 $2 $3)`),
				matcherForValue(`color(${colorSpace} $1 $2 $3 / $4)`),
			],
		};
	})),
];

export const hslMatchers = [
	{
		'supports': 'hsl(0, 0%, 0%)',
		'property': 'color',
		'sniff': 'hsl',
		'matchers': [
			matcherForValue('hsl($1,$2,$3,$4)'),
		],
	},
	{
		'supports': 'hsl(0 0% 0% / 0)',
		'property': 'color',
		'sniff': 'hsl',
		'matchers': [
			matcherForValue('hsl($1 $2 $3)'),
			matcherForValue('hsl($1 $2 $3 / $4)'),
		],
	},
	{
		'supports': 'hsla(0 0% 0% / 0)',
		'property': 'color',
		'sniff': 'hsla',
		'matchers': [
			matcherForValue('hsla($1 $2 $3 / $4)'),
		],
	},
];

export const hwbMatchers = [
	{
		'supports': 'hwb(0 0% 0%)',
		'property': 'color',
		'sniff': 'hwb',
		'matchers': [
			matcherForValue('hwb($1 $2 $3)'),
			matcherForValue('hwb($1 $2 $3 / $4)'),
		],
	},
];

export const labMatchers = [
	{
		'supports': 'lab(0% 0 0)',
		'property': 'color',
		'sniff': 'lab',
		'matchers': [
			matcherForValue('lab($1 $2 $3)'),
			matcherForValue('lab($1 $2 $3 / $4)'),
		],
	},
];

export const lchMatchers = [
	{
		'supports': 'lch(0% 0 0)',
		'property': 'color',
		'sniff': 'lch',
		'matchers': [
			matcherForValue('lch($1 $2 $3)'),
			matcherForValue('lch($1 $2 $3 / $4)'),
		],
	},
];

export const oklabMatchers = [
	{
		'supports': 'oklab(0% 0 0)',
		'property': 'color',
		'sniff': 'oklab',
		'matchers': [
			matcherForValue('oklab($1 $2 $3)'),
			matcherForValue('oklab($1 $2 $3 / $4)'),
		],
	},
];

export const oklchMatchers = [
	{
		'supports': 'oklch(0% 0 0)',
		'property': 'color',
		'sniff': 'oklch',
		'matchers': [
			matcherForValue('oklch($1 $2 $3)'),
			matcherForValue('oklch($1 $2 $3 / $4)'),
		],
	},
];

export const rgbMatchers = [
	{
		'supports': 'rgb(0, 0, 0, 0)',
		'property': 'color',
		'sniff': 'rgb',
		'matchers': [
			matcherForValue('rgb($1,$2,$3,$4)'),
		],
	},
	{
		'supports': 'rgb(0 0 0 / 0)',
		'property': 'color',
		'sniff': 'rgb',
		'matchers': [
			matcherForValue('rgb($1 $2 $3)'),
			matcherForValue('rgb($1 $2 $3 / $4)'),
		],
	},
	{
		'supports': 'rgba(0 0 0 / 0)',
		'property': 'color',
		'sniff': 'rgba',
		'matchers': [
			matcherForValue('rgba($1 $2 $3 / $4)'),
		],
	},
];
