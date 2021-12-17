import plugin from './index';
import { cli, helpTextLogger } from '@csstools/base-cli';

cli(
	plugin,
	['importFrom', 'exportTo', 'preserve'],
	helpTextLogger(
		'postcss-custom-properties',
		'PostCSS Custom Properties',
		'Lets you use Custom Properties in CSS, following the CSS Custom Properties specification.',
		{
			importFrom: ['import-variables.js'],
			exportTo: ['export-variables.js'],
			preserve: true,
		},
	),
);
