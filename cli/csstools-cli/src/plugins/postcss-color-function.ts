import plugin from '@csstools/postcss-color-function';
import { cli, helpTextLogger } from '@csstools/base-cli';

export default function postcssColorFunction() {
	cli(
		plugin,
		['preserve', 'enableProgressiveCustomProperties'],
		helpTextLogger(
			'@csstools/cli postcss-color-function',
			'PostCSS Color Function',
			'Lets you use the color() function in CSS.',
			{
				preserve: true,
				enableProgressiveCustomProperties: false,
			},
		),
		false,
	);
}
