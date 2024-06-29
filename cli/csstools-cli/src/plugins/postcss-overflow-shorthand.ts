import plugin from 'postcss-overflow-shorthand';
import { cli, helpTextLogger } from '@csstools/base-cli';

export default async function postcssOverflowShorthand(): Promise<void> {
	await cli(
		plugin,
		['preserve'],
		helpTextLogger(
			'@csstools/cli postcss-overflow-shorthand',
			'PostCSS Overflow Shorthand',
			'Lets you use the `overflow` shorthand in CSS, following the CSS Overflow specification.',
			{
				preserve: true,
			},
		),
		false,
	);
}
