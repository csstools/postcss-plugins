import plugin from 'postcss-color-functional-notation';
import { cli, helpTextLogger } from '@csstools/base-cli';

export default function postcssOKLabFunction() {
	cli(
		plugin,
		['preserve', 'enableProgressiveCustomProperties'],
		helpTextLogger(
			'@csstools/cli postcss-oklab-function',
			'PostCSS OKLab Function',
			'Lets you use oklab() and oklch() color functions in CSS.',
			{
				preserve: true,
				enableProgressiveCustomProperties: false,
			},
		),
		false,
	);
}
