import plugin from '@csstools/postcss-text-decoration-shorthand';
import { cli, helpTextLogger } from '@csstools/base-cli';

export default function postcssTextDecorationShorthand() {
	cli(
		plugin,
		['preserve'],
		helpTextLogger(
			'@csstools/cli postcss-text-decoration-shorthand',
			'PostCSS Text Decoration Shorthand',
			'Lets you use text-decoration in it\'s shorthand form in CSS.',
			{
				preserve: true,
			},
		),
		false,
	);
}
