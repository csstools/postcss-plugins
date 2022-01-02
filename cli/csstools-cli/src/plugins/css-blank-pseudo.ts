import plugin from 'css-blank-pseudo';
import { cli, helpTextLogger } from '@csstools/base-cli';

export default function cssBlankPseudo() {
	cli(
		plugin,
		['preserve', 'replaceWith'],
		helpTextLogger(
			'@csstools/cli css-blank-pseudo',
			'PostCSS Blank Pseudo',
			'Lets you style form elements when they are empty, following the Selectors Level 4 specification.',
			{
				preserve: true,
				replaceWith: '.css-blank',
			},
		),
		false,
	);
}
