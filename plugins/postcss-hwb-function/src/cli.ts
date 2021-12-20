import plugin from './index';
import { cli, helpTextLogger } from '@csstools/base-cli';

cli(
	plugin,
	['preserve'],
	helpTextLogger(
		'postcss-hwb-function-cli',
		'PostCSS Hwb function',
		'Convert hwb() to rgb()',
		{
			preserve: true,
		},
	),
);
