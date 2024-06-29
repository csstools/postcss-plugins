import plugin from 'postcss-focus-within';
import { cli, helpTextLogger } from '@csstools/base-cli';

export default async function postcssFocusWithin(): Promise<void> {
	await cli(
		plugin,
		['preserve', 'replaceWith'],
		helpTextLogger(
			'@csstools/cli postcss-focus-within',
			'PostCSS Focus Within',
			'Lets you use the `:focus-within` pseudo-class in CSS, following the Selectors Level 4 specification.',
			{
				preserve: true,
				replaceWith: '.focus-within',
			},
		),
		false,
	);
}
