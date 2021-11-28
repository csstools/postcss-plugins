import plugin from './index';
import { cli, helpTextLogger } from '@csstools/base-cli';

cli(
	plugin,
	['preserve'],
	helpTextLogger(
		'postcss-double-position-gradients',
		'PostCSS Double Position Gradients',
		'Lets you use double-position gradients in CSS, following the [CSS Image Values and Replaced Content] specification',
		{
			dir: 'ltr',
			preserve: true,
			shadow: true,
		},
	),
);
