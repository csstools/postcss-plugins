import plugin from '@csstools/postcss-exponential-functions';
import { cli, helpTextLogger } from '@csstools/base-cli';

export default async function postcssExponentialFunctions(): Promise<void> {
	await cli(
		plugin,
		['preserve'],
		helpTextLogger(
			'@csstools/cli postcss-exponential-functions',
			'PostCSS Exponential Functions',
			'Lets you use the `pow()`, `sqrt()`, `hypot()`, `log()`, `exp()` functions following the CSS Values 4 Specification.',
			{
				preserve: true,
			},
		),
		false,
	);
}
