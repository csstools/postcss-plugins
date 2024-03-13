import plugin from '@csstools/postcss-light-dark-function';
import { cli, helpTextLogger } from '@csstools/base-cli';

export default function postcssLightDarkFunction(): void {
	cli(
		plugin,
		['preserve'],
		helpTextLogger(
			'@csstools/cli postcss-light-dark-function',
			'PostCSS Light Dark function',
			'Use the light-dark() color function in CSS',
			{
				preserve: true,
			},
		),
		false,
	);
}
