import plugin from './index';
import { cli, helpTextLogger } from '@csstools/base-cli';

cli(
	plugin,
	['oninvalid', 'preserve'],
	helpTextLogger(
		'postcss-image-set-function',
		'PostCSS Image Set Function',
		'Lets you display resolution-dependent images using the image-set() function in CSS, following the CSS Images specification.',
		{
			preserve: true,
			oninvalid: 'ignore|warn|throw',
		},
	),
);
