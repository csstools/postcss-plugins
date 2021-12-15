import plugin from './index';
import { cli, helpTextLogger } from '@csstools/base-cli';

cli(
	plugin,
	['preserve'],
	helpTextLogger(
		'postcss-color-rebeccapurple',
		'PostCSS RebeccaPurple',
		'Lets you use the rebeccapurple color keyword in CSS.',
		{
			preserve: true,
		},
	),
);
