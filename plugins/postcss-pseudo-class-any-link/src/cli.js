import plugin from './index';
import { cli, helpTextLogger } from '@csstools/base-cli';

cli(
	plugin,
	['preserve'],
	helpTextLogger(
		'postcss-pseudo-class-any-link',
		'PostCSS Pseudo Class Any Link',
		'Lets you :any-link pseudo-class in CSS, following the Selectors specification.',
		{
			preserve: true,
		},
	),
);
