import { matcherForValue } from './matcher-for-value.mjs';

export const contrastColorMatchers = [
	{
		'supports': 'contrast-color(red)',
		'property': 'color',
		'sniff': 'contrast-color(',
		'matchers': [
			matcherForValue('contrast-color($1)'),
			matcherForValue('contrast-color($1)'),
		],
	},
];
