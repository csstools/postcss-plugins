import plugin from './index';
import { cli, helpTextLogger } from '@csstools/base-cli';

cli(
	plugin,
	['dir', 'preserve'],
	helpTextLogger(
		'postcss-logical',
		'PostCSS Logical',
		'Lets you use logical, rather than physical, direction and dimension mappings in CSS, following the CSS Logical Properties and Values specification.',
		{
			dir: 'ltr|rtl',
			preserve: true,
		},
	),
);
