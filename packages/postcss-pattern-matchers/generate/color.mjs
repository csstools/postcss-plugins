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
			'feature': 'color',
			'supports': `(color: color(${colorSpace} 0 0 0))`,
			'sniff': 'color(',
			'matchers': [
				matcherForValue(`color(${colorSpace} $1 $2 $3)`),
				matcherForValue(`color(${colorSpace} $1 $2 $3 / $4)`),
			],
		};
	})),
];

export const hslMatchers = [
	{
		'feature': 'hsl',
		'supports': '(color: hsl(0, 0%, 0%))',
		'sniff': 'hsl(',
		'matchers': [
			matcherForValue('hsl($1,$2,$3,$4)'),
		],
	},
	{
		'feature': 'hsl',
		'supports': '(color: hsl(0 0% 0% / 0))',
		'sniff': 'hsl(',
		'matchers': [
			matcherForValue('hsl($1 $2 $3)'),
			matcherForValue('hsl($1 $2 $3 / $4)'),
		],
	},
	{
		'feature': 'hsla',
		'supports': '(color: hsla(0 0% 0% / 0))',
		'sniff': 'hsla(',
		'matchers': [
			matcherForValue('hsla($1 $2 $3 / $4)'),
		],
	},
];

export const hwbMatchers = [
	{
		'feature': 'hwb',
		'supports': '(color: hwb(0 0% 0%))',
		'sniff': 'hwb(',
		'matchers': [
			matcherForValue('hwb($1 $2 $3)'),
			matcherForValue('hwb($1 $2 $3 / $4)'),
		],
	},
];

export const labMatchers = [
	{
		'feature': 'lab',
		'supports': '(color: lab(0% 0 0))',
		'sniff': 'lab(',
		'matchers': [
			matcherForValue('lab($1 $2 $3)'),
			matcherForValue('lab($1 $2 $3 / $4)'),
		],
	},
];

export const lchMatchers = [
	{
		'feature': 'lch',
		'supports': '(color: lch(0% 0 0))',
		'sniff': 'lch(',
		'matchers': [
			matcherForValue('lch($1 $2 $3)'),
			matcherForValue('lch($1 $2 $3 / $4)'),
		],
	},
];

export const oklabMatchers = [
	{
		'feature': 'oklab',
		'supports': '(color: oklab(0% 0 0))',
		'sniff': 'oklab(',
		'matchers': [
			matcherForValue('oklab($1 $2 $3)'),
			matcherForValue('oklab($1 $2 $3 / $4)'),
		],
	},
];

export const oklchMatchers = [
	{
		'feature': 'oklch',
		'supports': '(color: oklch(0% 0 0))',
		'sniff': 'oklch(',
		'matchers': [
			matcherForValue('oklch($1 $2 $3)'),
			matcherForValue('oklch($1 $2 $3 / $4)'),
		],
	},
];

export const rgbMatchers = [
	{
		'feature': 'rgb',
		'supports': '(color: rgb(0, 0, 0, 0))',
		'sniff': 'rgb(',
		'matchers': [
			matcherForValue('rgb($1,$2,$3,$4)'),
		],
	},
	{
		'feature': 'rgb',
		'supports': '(color: rgb(0 0 0 / 0))',
		'sniff': 'rgb(',
		'matchers': [
			matcherForValue('rgb($1 $2 $3)'),
			matcherForValue('rgb($1 $2 $3 / $4)'),
		],
	},
	{
		'feature': 'rgba',
		'supports': '(color: rgba(0 0 0 / 0))',
		'sniff': 'rgba(',
		'matchers': [
			matcherForValue('rgba($1 $2 $3 / $4)'),
		],
	},
];
