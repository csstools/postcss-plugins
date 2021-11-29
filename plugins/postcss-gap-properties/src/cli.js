import plugin from './index';
import { cli, helpTextLogger } from '@csstools/base-cli';

cli(
	plugin,
	['preserve'],
	helpTextLogger(
		'postcss-gap-properties',
		'PostCSS Gap Properties',
		'Lets you use the gap, column-gap, and row-gap shorthand properties in CSS, following the CSS Grid Layout specification.',
		{
			preserve: true,
		},
	),
);
