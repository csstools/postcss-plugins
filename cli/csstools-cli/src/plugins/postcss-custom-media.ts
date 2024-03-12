import plugin from 'postcss-custom-media';
import { cli, helpTextLogger } from '@csstools/base-cli';

export default function postcssCustomMedia(): void {
	cli(
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
