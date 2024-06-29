import plugin from 'postcss-custom-media';
import { cli, helpTextLogger } from '@csstools/base-cli';

export default async function postcssCustomMedia(): Promise<void> {
	await cli(
		plugin,
		['preserve'],
		helpTextLogger(
			'@csstools/cli postcss-custom-media',
			'PostCSS Custom Media',
			'Lets you define @custom-media in CSS following the Custom Media Specification',
			{
				preserve: true,
			},
		),
		false,
	);
}
