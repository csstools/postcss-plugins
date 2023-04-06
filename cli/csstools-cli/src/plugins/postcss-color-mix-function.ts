import plugin from '@csstools/postcss-color-mix-function';
import { cli, helpTextLogger } from '@csstools/base-cli';

export default function postcssColorMixFunction() {
	cli(
		plugin,
		['preserve', 'enableProgressiveCustomProperties'],
		helpTextLogger(
			'@csstools/cli postcss-color-mix-function',
			'PostCSS Color Mix Function',
			'Lets you use the color-mix() function in CSS.',
			{
				preserve: true,
				enableProgressiveCustomProperties: false,
				subFeatures: {
					displayP3: false,
				},
			},
		),
		false,
	);
}
