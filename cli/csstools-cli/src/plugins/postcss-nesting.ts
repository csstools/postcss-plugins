import plugin from 'postcss-nesting';
import { cli, helpTextLogger } from '@csstools/base-cli';

export default async function postcssNesting(): Promise<void> {
	await cli(
		plugin,
		['noIsPseudoSelector'],
		helpTextLogger(
			'@csstools/cli postcss-nesting',
			'PostCSS Nesting',
			'Lets you nest style rules inside each other, following the CSS Nesting specification.',
			{
				noIsPseudoSelector: true,
			},
		),
		false,
	);
}
