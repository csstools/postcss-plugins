import plugin from 'postcss-image-set-function';
import { cli, helpTextLogger } from '@csstools/base-cli';

export default function postcssImageSetFunction() {
	cli(
		plugin,
		['oninvalid', 'preserve'],
		helpTextLogger(
			'@csstools/cli postcss-image-set-function',
			'PostCSS Image Set Function',
			'Lets you display resolution-dependent images using the image-set() function in CSS, following the CSS Images specification.',
			{
				preserve: true,
				oninvalid: 'ignore|warn|throw',
			},
		),
		false,
	);
}
