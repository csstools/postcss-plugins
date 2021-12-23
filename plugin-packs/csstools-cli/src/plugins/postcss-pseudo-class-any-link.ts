import plugin from 'postcss-pseudo-class-any-link';
import { cli, helpTextLogger } from '@csstools/base-cli';

export default function postcssPseudoClassAnyLink() {
	cli(
		plugin,
		['preserve'],
		helpTextLogger(
			'@csstools/cli postcss-pseudo-class-any-link',
			'PostCSS Pseudo Class Any Link',
			'Lets you :any-link pseudo-class in CSS, following the Selectors specification.',
			{
				preserve: true,
			},
		),
		false,
	);
}
