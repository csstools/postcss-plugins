import plugin from './index';
import { cli, helpTextLogger } from '@csstools/base-cli';

cli(
	plugin,
	['dir', 'preserve', 'shadow'],
	helpTextLogger(
		'postcss-dir-pseudo-class',
		'PostCSS Dir Pseudo Class',
		'Lets you style by directionality using the `:dir()` pseudo-class in CSS',
		{
			dir: 'ltr',
			preserve: true,
			shadow: true,
		},
	),
);
