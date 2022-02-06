import plugin from 'postcss-dir-pseudo-class';
import { cli, helpTextLogger } from '@csstools/base-cli';

export default function postcssDirPseudoClass() {
	cli(
		plugin,
		['dir', 'preserve', 'shadow'],
		helpTextLogger(
			'@csstools/cli postcss-dir-pseudo-class',
			'PostCSS Dir Pseudo Class',
			'Lets you style by directionality using the `:dir()` pseudo-class in CSS',
			{
				dir: 'ltr',
				preserve: true,
				shadow: true,
			},
		),
		false,
	);
}
