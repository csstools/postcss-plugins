import { matcherForValue } from './matcher-for-value.mjs';

export const hasPseudoMatchers = [
	{
		'feature': 'has',
		'supports': 'selector(:has(f))',
		'sniff': ':has(',
		'matchers': [
			matcherForValue('selector(:has(...$1))'),
		],
	},
];
