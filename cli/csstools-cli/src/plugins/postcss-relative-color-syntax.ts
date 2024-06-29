import plugin from '@csstools/postcss-relative-color-syntax';
import { cli, helpTextLogger } from '@csstools/base-cli';

export default async function postcssRelativeColorSyntax(): Promise<void> {
	await cli(
		plugin,
		['preserve', 'enableProgressiveCustomProperties', 'subFeatures'],
		helpTextLogger(
			'@csstools/cli postcss-relative-color-syntax',
			'PostCSS Relative Color Syntax',
			'Lets you use the relative color syntax in CSS color functions.',
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
