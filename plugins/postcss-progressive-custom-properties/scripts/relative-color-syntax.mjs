import { matcherForValue } from './matcher-for-value.mjs';

export const relativeColorSyntaxMatches = [
	{
		'supports': 'rgb(from red calc(r + 1) 1 1%)',
		'property': 'color',
		'sniff': 'from ',
		'matchers': [
			matcherForValue('rgb(from $a $1 $2 $3)'),
			matcherForValue('rgb(from $a $1 $2 $3 / $4)'),
			matcherForValue('hsl(from $a $1 $2 $3)'),
			matcherForValue('hsl(from $a $1 $2 $3 / $4)'),
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
