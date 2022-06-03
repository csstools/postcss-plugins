import plugin from 'postcss-custom-selectors';
import { cli, helpTextLogger } from '@csstools/base-cli';

export default function postcssCustomSelectors() {
	cli(
		plugin,
		['importFrom', 'exportTo', 'preserve'],
		helpTextLogger(
			'@csstools/cli postcss-custom-selectors',
			'PostCSS Custom Selectors',
			'Lets you define @custom-selector in CSS following the Custom Selectors Specification',
			{
				importFrom: ['import-selectors.js'],
				exportTo: ['export-selectors.js'],
				preserve: true,
			},
		),
		false,
	);
}
