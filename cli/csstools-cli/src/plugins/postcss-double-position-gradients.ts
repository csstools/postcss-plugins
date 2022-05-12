import plugin from 'postcss-double-position-gradients';
import { cli, helpTextLogger } from '@csstools/base-cli';

export default function postcssDoublePositionGradients() {
	cli(
		plugin,
		['preserve', 'enableProgressiveCustomProperties'],
		helpTextLogger(
			'@csstools/cli postcss-double-position-gradients',
			'PostCSS Double Position Gradients',
			'Lets you use double-position gradients in CSS, following the CSS Image Values and Replaced Content specification',
			{
				preserve: true,
				enableProgressiveCustomProperties: false,
			},
		),
		false,
	);
}
