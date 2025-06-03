import { matcherForValue } from './matcher-for-value.mjs';

export const colorMixMatchers = [
	{
		'supports': 'color-mix(in lch, red, blue)',
		'property': 'color',
		'sniff': 'color-mix',
		'matchers': [
			matcherForValue('color-mix(in $a,$1,$2)'),
			matcherForValue('color-mix(in $a,$1 $2,$3)'),
			matcherForValue('color-mix(in $a,$1,$2 $3)'),
			matcherForValue('color-mix(in $a,$1 $2,$3 $4)'),

			matcherForValue('color-mix(in $a $b hue,$1,$2)'),
			matcherForValue('color-mix(in $a $b hue,$1 $2,$3)'),
			matcherForValue('color-mix(in $a $b hue,$1,$2 $3)'),
			matcherForValue('color-mix(in $a $b hue,$1 $2,$3 $4)'),
		],
	},
	{
		'supports': 'color-mix(in lch, red)',
		'property': 'color',
		'sniff': 'color-mix',
		'matchers': [
			matcherForValue('color-mix(in $a,$1)'),
			matcherForValue('color-mix(in $a,$1 $2)'),

			matcherForValue('color-mix(in $a $b hue,$1)'),
			matcherForValue('color-mix(in $a $b hue,$1 $2)'),

			matcherForValue('color-mix(in $a,$1,$2, _z)'),
			matcherForValue('color-mix(in $a,$1 $2,$3, _z)'),
			matcherForValue('color-mix(in $a,$1,$2 $3, _z)'),
			matcherForValue('color-mix(in $a,$1 $2,$3 $4, _z)'),

			matcherForValue('color-mix(in $a $b hue,$1,$2, _z)'),
			matcherForValue('color-mix(in $a $b hue,$1 $2,$3, _z)'),
			matcherForValue('color-mix(in $a $b hue,$1,$2 $3, _z)'),
			matcherForValue('color-mix(in $a $b hue,$1 $2,$3 $4, _z)'),
		],
	},
];
