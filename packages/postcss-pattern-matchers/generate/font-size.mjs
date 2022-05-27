import { matcherForValue } from './matcher-for-value.mjs';

export const icUnitMatchers = [
	{
		'feature': 'ic',
		'supports': '(font-size: 1ic)',
		'sniff': 'ic',
		'matchers': [
			matcherForValue('1ic'),
		],
	},
];
