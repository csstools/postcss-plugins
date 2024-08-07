import plugin from '@csstools/postcss-hwb-function';
import { cli, helpTextLogger } from '@csstools/base-cli';

export default async function postcssHWBFunction(): Promise<void> {
	await cli(
		plugin,
		['preserve'],
		helpTextLogger(
			'@csstools/cli postcss-hwb-function',
			'PostCSS HWB function',
			'Convert hwb() to rgb()',
			{
				preserve: true,
			},
		),
		false,
	);
}
