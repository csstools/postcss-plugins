import plugin from 'postcss-custom-properties';
import { cli, helpTextLogger } from '@csstools/base-cli';

export default async function postcssCustomProperties(): Promise<void> {
	await cli(
		plugin,
		['preserve'],
		helpTextLogger(
			'@csstools/cli postcss-custom-properties',
			'PostCSS Custom Properties',
			'Lets you use Custom Properties in CSS, following the CSS Custom Properties specification.',
			{
				preserve: true,
			},
		),
		false,
	);
}
