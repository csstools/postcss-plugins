import plugin from '@csstools/postcss-color-function';
import { cli, helpTextLogger } from '@csstools/base-cli';

export default async function postcssColorFunction(): Promise<void> {
	await cli(
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
