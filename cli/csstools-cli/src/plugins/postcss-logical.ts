import plugin from 'postcss-logical';
import { cli, helpTextLogger } from '@csstools/base-cli';

export default function postcssLogical() {
	cli(
		plugin,
		['dir', 'preserve'],
		helpTextLogger(
			'@csstools/cli postcss-logical',
			'PostCSS Logical',
			'Lets you use logical, rather than physical, direction and dimension mappings in CSS, following the CSS Logical Properties and Values specification.',
			{
				dir: 'ltr|rtl',
				preserve: true,
			},
		),
		false,
	);
}
