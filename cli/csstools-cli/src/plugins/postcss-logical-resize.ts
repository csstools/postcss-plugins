import plugin from '@csstools/postcss-logical-resize';
import { cli, helpTextLogger } from '@csstools/base-cli';

export default function postcssLogicalResize(): void {
	cli(
		plugin,
		['inlineDirection'],
		helpTextLogger(
			'@csstools/cli postcss-logical-resize',
			'PostCSS Logical Resize',
			'Lets you use logical values in the resize property, following the CSS Logical Properties and Values specification.',
			{
				inlineDirection: 'left-to-right',
			},
		),
		false,
	);
}
