import { matcherForValue } from './matcher-for-value.mjs';

export const relativeColorSyntaxMatches = [
	{
		'supports': 'lab(from red l 1 1% / calc(alpha + 0.1))',
		'property': 'color',
		'sniff': 'from ',
		'matchers': [
			matcherForValue('rgb(from $a $1 $2 $3)'),
			matcherForValue('rgb(from $a $1 $2 $3 / $4)'),
			matcherForValue('rgba(from $a $1 $2 $3)'),
			matcherForValue('rgba(from $a $1 $2 $3 / $4)'),
			matcherForValue('hsl(from $a $1 $2 $3)'),
			matcherForValue('hsl(from $a $1 $2 $3 / $4)'),
			matcherForValue('hsla(from $a $1 $2 $3)'),
			matcherForValue('hsla(from $a $1 $2 $3 / $4)'),
			matcherForValue('hwb(from $a $1 $2 $3)'),
			matcherForValue('hwb(from $a $1 $2 $3 / $4)'),
			matcherForValue('lch(from $a $1 $2 $3)'),
			matcherForValue('lch(from $a $1 $2 $3 / $4)'),
			matcherForValue('oklch(from $a $1 $2 $3)'),
			matcherForValue('oklch(from $a $1 $2 $3 / $4)'),
			matcherForValue('lab(from $a $1 $2 $3)'),
			matcherForValue('lab(from $a $1 $2 $3 / $4)'),
			matcherForValue('oklab(from $a $1 $2 $3)'),
			matcherForValue('oklab(from $a $1 $2 $3 / $4)'),
			matcherForValue('color(from $a $b $1 $2 $3)'),
			matcherForValue('color(from $a $b $1 $2 $3 / $4)'),
		],
	},
];
