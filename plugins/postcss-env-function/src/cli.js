import plugin from './index';
import { cli, helpTextLogger } from '@csstools/base-cli';

cli(
	plugin,
	['importFrom'],
	helpTextLogger(
		'postcss-env-function',
		'PostCSS Environment Variables',
		'Lets you use `env()` variables in CSS, following the [CSS Environment Variables] specification.',
		{
			importFrom: ['import-variables.js'],
		},
	),
);
