import plugin from './index';
import { cli, helpTextLogger } from '@csstools/base-cli';

cli(
	plugin,
	['preserve'],
	helpTextLogger(
		'postcss-color-functional-notation',
		'PostCSS Color Functional Notation',
		'Lets you use space and slash separated color notation in CSS, following the [CSS Color] specification.',
		{
			preserve: true,
		},
	),
);
