import plugin from 'postcss-color-hex-alpha';
import { cli, helpTextLogger } from '@csstools/base-cli';

export default function postcssColorHexAlpha() {
	cli(
		plugin,
		['preserve'],
		helpTextLogger(
			'@csstools/cli postcss-color-hex-alpha',
			'PostCSS Color Hex Alpha',
			'Lets you use 4 & 8 character hex color notation in CSS, following the CSS Color Module specification.',
			{
				preserve: true,
			},
		),
		false,
	);
}
