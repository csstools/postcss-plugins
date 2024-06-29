import plugin from '@csstools/postcss-nested-calc';
import { cli, helpTextLogger } from '@csstools/base-cli';

export default async function postcssNestedCalc(): Promise<void> {
	await cli(
		plugin,
		['preserve'],
		helpTextLogger(
			'@csstools/cli postcss-nested-calc',
			'PostCSS Nested Calc',
			'Lets you use nested calc() expressions in CSS.',
			{
				preserve: true,
			},
		),
		false,
	);
}
