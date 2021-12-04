import plugin from './index';
import { cli, helpTextLogger } from '@csstools/base-cli';

cli(
	plugin,
	['preserve'],
	helpTextLogger(
		'postcss-lab-function-cli',
		'PostCSS Lab function',
		'Convert lab() to rgb()',
		{
			preserve: true,
		},
	),
);
