import plugin from '@csstools/postcss-gradients-interpolation-method';
import { cli, helpTextLogger } from '@csstools/base-cli';

export default function postcssGradientsInterpolationMethod(): void {
	cli(
		plugin,
		['preserve', 'enableProgressiveCustomProperties'],
		helpTextLogger(
			'@csstools/cli postcss-gradients-interpolation-method',
			'PostCSS Gradients Interpolation Method',
			'Lets you use different interpolation methods in CSS gradient functions.',
			{
				preserve: true,
				enableProgressiveCustomProperties: false,
			},
		),
		false,
	);
}
