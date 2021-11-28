import plugin from './index';
import { cli, helpTextLogger } from '@csstools/base-cli';

cli(
	plugin,
	['preserve', 'replaceWith'],
	helpTextLogger(
		'postcss-focus-visible',
		'PostCSS Focus Visible',
		'Lets you use the `:focus-visible` pseudo-class in CSS, following the Selectors Level 4 specification.',
		{
			preserve: true,
			replaceWith: '.focus-visible',
		},
	),
);
