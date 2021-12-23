import plugin from 'postcss-gap-properties';
import { cli, helpTextLogger } from '@csstools/base-cli';

export default function postcssGapProperties() {
	cli(
		plugin,
		['preserve'],
		helpTextLogger(
			'@csstools/cli postcss-gap-properties',
			'PostCSS Gap Properties',
			'Lets you use the gap, column-gap, and row-gap shorthand properties in CSS, following the CSS Grid Layout specification.',
			{
				preserve: true,
			},
		),
		false,
	);
}
