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

export const logicalUnitMatchers = [
	{
		'supports': '1vi',
		'property': 'width',
		'sniff': 'vi',
		'matchers': [
			matcherForValue('1vi'),
		],
	},
	{
		'supports': '1vi',
		'property': 'width',
		'sniff': 'svi',
		'matchers': [
			matcherForValue('1svi'),
		],
	},
	{
		'supports': '1vi',
		'property': 'width',
		'sniff': 'lvi',
		'matchers': [
			matcherForValue('1lvi'),
		],
	},
	{
		'supports': '1vi',
		'property': 'width',
		'sniff': 'vb',
		'matchers': [
			matcherForValue('1vb'),
		],
	},
	{
		'supports': '1vi',
		'property': 'width',
		'sniff': 'svb',
		'matchers': [
			matcherForValue('1svb'),
		],
	},
	{
		'supports': '1vi',
		'property': 'width',
		'sniff': 'lvb',
		'matchers': [
			matcherForValue('1lvb'),
		],
	},
];
