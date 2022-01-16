import plugin from 'postcss-overflow-shorthand';
import { cli, helpTextLogger } from '@csstools/base-cli';

export default function postcssOverflowShorthand() {
	cli(
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
