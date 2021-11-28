import plugin from './index';
import { cli, helpTextLogger } from '@csstools/base-cli';

cli(
	plugin,
	['preserve', 'replaceWith'],
	helpTextLogger(
		'css-blank-pseudo',
		'PostCSS Blank Pseudo',
		'Lets you style form elements when they are empty, following the Selectors Level 4 specification.',
		{
			preserve: true,
			replaceWith: '.css-blank',
		},
	),
);
