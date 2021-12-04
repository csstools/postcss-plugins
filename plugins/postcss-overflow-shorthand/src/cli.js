import plugin from './index';
import { cli, helpTextLogger } from '@csstools/base-cli';

cli(
	plugin,
	['preserve'],
	helpTextLogger(
		'postcss-overflow-shorthand',
		'PostCSS Overflow Shorthand',
		'Lets you use the `overflow` shorthand in CSS, following the CSS Overflow specification.',
		{
			preserve: true,
		},
	),
);
