import plugin from 'postcss-lab-function';
import { cli, helpTextLogger } from '@csstools/base-cli';

export default async function postcssLabFunction(): Promise<void> {
	await cli(
		plugin,
		['preserve', 'enableProgressiveCustomProperties', 'subFeatures'],
		helpTextLogger(
			'@csstools/cli postcss-lab-function',
			'PostCSS Lab function',
			'Convert lab() to rgb()',
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
