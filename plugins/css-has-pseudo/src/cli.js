import plugin from './index';
import { cli, helpTextLogger } from '@csstools/base-cli';

cli(
	plugin,
	['preserve'],
	helpTextLogger(
		'css-has-pseudo',
		'PostCSS Has Pseudo',
		'Transforms CSS with :has {}',
		{
			preserve: true,
		},
	),
);
