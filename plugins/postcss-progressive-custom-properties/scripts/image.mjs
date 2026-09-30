import { matcherForValue } from './matcher-for-value.mjs';

export const imageMatchers = [
	{
		'supports': 'image(red)',
		'property': 'background-image',
		'sniff': 'image(',
		'matchers': [
			matcherForValue('image($1)'),
		],
	},
];
