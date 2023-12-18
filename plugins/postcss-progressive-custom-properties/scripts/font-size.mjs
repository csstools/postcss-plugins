import { matcherForValue } from './matcher-for-value.mjs';

export const icUnitMatchers = [
	{
		'supports': '1ic',
		'property': 'font-size',
		'sniff': 'ic',
		'matchers': [
			matcherForValue('1ic'),
		],
	},
];
