import { matcherForValue } from './matcher-for-value.mjs';

export const contentMatchers = [
	{
		'supports': '"a" / "a"',
		'property': 'content',
		'only_on_property': 'content',
		'sniff': '/',
		'matchers': [
			matcherForValue('/'),
		],
	},
];
