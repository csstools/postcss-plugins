import plugin from 'postcss-custom-properties';
import { cli, helpTextLogger } from '@csstools/base-cli';

export default function postcssCustomProperties(): void {
	cli(
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
