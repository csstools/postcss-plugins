import plugin from './index';
import { cli, helpTextLogger } from '@csstools/base-cli';

cli(
	plugin,
	['preserve'],
	helpTextLogger(
		'postcss-place',
		'PostCSS Place',
		'Lets you use place-* properties as shorthands for align-* and justify-*, following the CSS Box Alignment specification.',
		{
			preserve: true,
		},
	),
);
