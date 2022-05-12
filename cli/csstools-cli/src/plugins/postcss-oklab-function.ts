import plugin from '@csstools/postcss-oklab-function';
import { cli, helpTextLogger } from '@csstools/base-cli';

export default function postcssOKLabFunction() {
	cli(
		plugin,
		['preserve', 'enableProgressiveCustomProperties', 'subFeatures'],
		helpTextLogger(
			'@csstools/cli postcss-oklab-function',
			'PostCSS OKLab Function',
			'Lets you use oklab() and oklch() color functions in CSS.',
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
