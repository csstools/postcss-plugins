import plugin from 'postcss-color-functional-notation';
import { cli, helpTextLogger } from '@csstools/base-cli';

export default function postcssICUnit() {
	cli(
		plugin,
		['preserve'],
		helpTextLogger(
			'@csstools/cli postcss-ic-unit',
			'PostCSS IC Unit',
			'Lets you use the ic length unit.',
			{
				preserve: true,
			},
		),
		false,
	);
}
