import plugin from '@csstools/postcss-ic-unit';
import { cli, helpTextLogger } from '@csstools/base-cli';

export default function postcssICUnit() {
	cli(
		plugin,
		['preserve', 'enableProgressiveCustomProperties'],
		helpTextLogger(
			'@csstools/cli postcss-ic-unit',
			'PostCSS IC Unit',
			'Lets you use the ic length unit.',
			{
				preserve: true,
				enableProgressiveCustomProperties: false,
			},
		),
		false,
	);
}
