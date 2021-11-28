import plugin from './index';
import { cli, helpTextLogger } from '@csstools/base-cli';

cli(
	plugin,
	['preserve', 'replaceWith'],
	helpTextLogger(
		'postcss-focus-within',
		'PostCSS Focus Within',
		'Lets you use the `:focus-within` pseudo-class in CSS, following the Selectors Level 4 specification.',
		{
			preserve: true,
			replaceWith: '.focus-within',
		},
	),
);
