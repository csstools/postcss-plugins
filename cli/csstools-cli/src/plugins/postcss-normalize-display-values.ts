import plugin from '@csstools/postcss-normalize-display-values';
import { cli, helpTextLogger } from '@csstools/base-cli';

export default async function postcssNormalizeDisplayValues(): Promise<void> {
	await cli(
		plugin,
		['preserve'],
		helpTextLogger(
			'@csstools/cli postcss-normalize-display-values',
			'PostCSS Normalize Display Values',
			'Lets you use two values display syntax for inner and outer display types.',
			{
				preserve: true,
			},
		),
		false,
	);
}
