import plugin from '@csstools/postcss-is-pseudo-class';
import { cli, helpTextLogger } from '@csstools/base-cli';

export default function postcssIsPseudoClass() {
	cli(
		plugin,
		['onComplexSelector', 'preserve', 'specificityMatchingName'],
		helpTextLogger(
			'@csstools/cli postcss-is-pseudo-class',
			'PostCSS Is Pseudo Class',
			'Lets you use the :is pseudo class function, following the CSS Selector specification.',
			{
				onComplexSelector: 'warning',
				preserve: true,
				specificityMatchingName: 'does-not-exist',
			},
		),
		false,
	);
}
