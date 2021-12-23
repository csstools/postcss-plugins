import plugin from 'postcss-nesting';
import { cli, helpTextLogger } from '@csstools/base-cli';

export default function postcssNesting() {
	cli(
		plugin,
		['noIsPseudoSelector'],
		helpTextLogger(
			'postcss-nesting',
			'PostCSS Nesting',
			'Lets you nest style rules inside each other, following the CSS Nesting specification.',
			{
				noIsPseudoSelector: true,
			},
		),
		false,
	);
}
