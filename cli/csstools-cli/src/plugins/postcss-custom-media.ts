import plugin from 'postcss-custom-media';
import { cli, helpTextLogger } from '@csstools/base-cli';

export default function postcssCustomMedia() {
	cli(
		plugin,
		['importFrom', 'exportTo', 'preserve'],
		helpTextLogger(
			'@csstools/cli postcss-custom-media',
			'PostCSS Custom Media',
			'Lets you define @custom-media in CSS following the Custom Media Specification',
			{
				importFrom: ['import-media.js'],
				exportTo: ['export-media.js'],
				preserve: true,
			},
		),
		false,
	);
}
