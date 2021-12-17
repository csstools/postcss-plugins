import plugin from './index';
import { cli, helpTextLogger } from '@csstools/base-cli';

cli(
	plugin,
	['preserve'],
	helpTextLogger(
		'postcss-color-hex-alpha',
		'PostCSS Color Hex Alpha',
		'Lets you use 4 & 8 character hex color notation in CSS, following the CSS Color Module specification.',
		{
			preserve: true,
		},
	),
);
