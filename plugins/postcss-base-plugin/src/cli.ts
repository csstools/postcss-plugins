import plugin from './index';
import { cli, helpTextLogger } from '@csstools/base-cli';

cli(
	plugin,
	['color', 'another_option'],
	helpTextLogger(
		'postcss-base-plugin-cli',
		'Base Plugin',
		'An example plugin CLI',
		{
			color: 'A CSS color',
			another_option: true,
		},
	),
);
