import plugin from 'postcss-color-rebeccapurple';
import { cli, helpTextLogger } from '@csstools/base-cli';

export default function postcssColorRebeccaPurple(): void {
	cli(
		plugin,
		['preserve'],
		helpTextLogger(
			'@csstools/cli postcss-color-rebeccapurple',
			'PostCSS RebeccaPurple',
			'Lets you use the rebeccapurple color keyword in CSS.',
			{
				preserve: true,
			},
		),
		false,
	);
}
