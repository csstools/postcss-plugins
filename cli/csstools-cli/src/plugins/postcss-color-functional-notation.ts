import plugin from 'postcss-color-functional-notation';
import { cli, helpTextLogger } from '@csstools/base-cli';

export default function postcssColorFunctionalNotation() {
	cli(
		plugin,
		['preserve'],
		helpTextLogger(
			'@csstools/cli postcss-color-functional-notation',
			'PostCSS Color Functional Notation',
			'Lets you use space and slash separated color notation in CSS, following the CSS Color specification.',
			{
				preserve: true,
			},
		),
		false,
	);
}
