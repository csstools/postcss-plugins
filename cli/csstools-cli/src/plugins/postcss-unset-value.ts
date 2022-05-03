import plugin from '@csstools/postcss-unset-value';
import { cli, helpTextLogger } from '@csstools/base-cli';

export default function postcssUnsetValue() {
	cli(
		plugin,
		['preserve'],
		helpTextLogger(
			'@csstools/cli postcss-unset-value',
			'PostCSS Stepped Unset Value',
			'Use the unset keyword in CSS.',
			{
				preserve: false,
			},
		),
		false,
	);
}
