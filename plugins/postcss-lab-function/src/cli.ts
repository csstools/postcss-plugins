import plugin from './index';
import { cli, helpTextLogger } from '@csstools/base-cli';

cli(
	plugin,
	['color', 'another_option'],
	helpTextLogger(
		'postcss-lab-function-cli',
		'PostCSS Lab function',
		'Convert lab() to rgb()',
	),
);
