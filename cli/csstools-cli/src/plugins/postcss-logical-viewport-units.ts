import plugin from '@csstools/postcss-logical-viewport-units';
import { cli, helpTextLogger } from '@csstools/base-cli';

export default function postcssLogicalViewportUnits(): void {
	cli(
		plugin,
		['inlineDirection', 'preserve'],
		helpTextLogger(
			'@csstools/cli postcss-viewport-units',
			'PostCSS Logical Viewport Units',
			'Lets you use vb and vi length units in CSS, following the CSS Values and Units Module Level 4 specification.',
			{
				inlineDirection: 'left-to-right',
				preserve: true,
			},
		),
		false,
	);
}
