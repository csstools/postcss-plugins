import plugin from 'postcss-focus-visible';
import { cli, helpTextLogger } from '@csstools/base-cli';

export default function postcssFocusVisible() {
	cli(
		plugin,
		['preserve', 'replaceWith'],
		helpTextLogger(
			'@csstools/cli postcss-focus-visible',
			'PostCSS Focus Visible',
			'Lets you use the `:focus-visible` pseudo-class in CSS, following the Selectors Level 4 specification.',
			{
				preserve: true,
				replaceWith: '.focus-visible',
			},
		),
		false,
	);
}
