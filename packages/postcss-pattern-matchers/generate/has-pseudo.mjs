import { matcherForSelector } from './matcher-for-selector.mjs';
import { matcherForValue } from './matcher-for-value.mjs';

export const hasPseudoMatchers = [
	{
		'feature': 'has',
		'supports': 'selector(:has(f))',
		'sniff': ':has(',
		'matchers': [
			matcherForSelector(':has($$)'),
			matcherForValue('selector(:has($$), :is(foo))'),
		],
	},
];
