import { matcherForValue } from './matcher-for-value.mjs';

export const colorMixMatchers = [
	{
		'supports': 'color-mix(in oklch, #000, #fff)',
		'property': 'color',
		'sniff': 'color-mix',
		'matchers': [
			matcherForValue('color-mix(in $a,$1,$2)'),
			matcherForValue('color-mix(in $a,$1 $2,$3)'),
			matcherForValue('color-mix(in $a,$1,$2 $3)'),
			matcherForValue('color-mix(in $a,$1 $2,$3 $4)'),

			matcherForValue('color-mix(in $a $b,$1,$2)'),
			matcherForValue('color-mix(in $a $b,$1 $2,$3)'),
			matcherForValue('color-mix(in $a $b,$1,$2 $3)'),
			matcherForValue('color-mix(in $a $b,$1 $2,$3 $4)'),
		],
	},
];
