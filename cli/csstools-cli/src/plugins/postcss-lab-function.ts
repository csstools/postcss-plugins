import plugin from 'postcss-lab-function';
import { cli, helpTextLogger } from '@csstools/base-cli';

export default function postcssLabFunction() {
	cli(
		plugin,
		['preserve'],
		helpTextLogger(
			'@csstools/cli postcss-lab-function',
			'PostCSS Lab function',
			'Convert lab() to rgb()',
			{
				preserve: true,
			},
		),
		false,
	);
}
