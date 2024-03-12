import plugin from 'postcss-custom-selectors';
import { cli, helpTextLogger } from '@csstools/base-cli';

export default function postcssCustomSelectors(): void {
	cli(
		plugin,
		['preserve'],
		helpTextLogger(
			'@csstools/cli postcss-custom-selectors',
			'PostCSS Custom Selectors',
			'Lets you define @custom-selector in CSS following the Custom Selectors Specification',
			{
				preserve: true,
			},
		),
		false,
	);
}
