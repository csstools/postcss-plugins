import plugin from '@csstools/postcss-stepped-value-functions';
import { cli, helpTextLogger } from '@csstools/base-cli';

export default function postcssSteppedValueFunctions() {
	cli(
		plugin,
		['preserve', 'onInvalid'],
		helpTextLogger(
			'@csstools/cli postcss-stepped-value-functions',
			'PostCSS Stepped Value Functions',
			'Lets you use round(), mod() and rem() functions.',
			{
				preserve: false,
				onInvalid: 'warn',
			},
		),
		false,
	);
}
