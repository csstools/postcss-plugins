import plugin from 'postcss-logical';
import { cli, helpTextLogger } from '@csstools/base-cli';

export default function postcssLogical(): void {
	cli(
		plugin,
		['inlineDirection', 'blockDirection'],
		helpTextLogger(
			'@csstools/cli postcss-logical',
			'PostCSS Logical',
			'Lets you use logical, rather than physical, direction and dimension mappings in CSS, following the CSS Logical Properties and Values specification.',
			{
				inlineDirection: 'left-to-right',
				blockDirection: 'top-to-bottom',
			},
		),
		false,
	);
}
