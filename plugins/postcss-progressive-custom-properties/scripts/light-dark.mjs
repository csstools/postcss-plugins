import { matcherForValue } from './matcher-for-value.mjs';

export const lightDarkMatchers = [
	{
		'supports': 'light-dark(red, red)',
		'property': 'color',
		'sniff': 'light-dark',
		'matchers': [
			matcherForValue('light-dark($1,$2)'),
		],
	},
];
