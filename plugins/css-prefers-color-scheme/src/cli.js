import plugin from './index';
import { cli, helpTextLogger } from '@csstools/base-cli';

cli(
	plugin,
	['preserve', 'mediaQuery'],
	helpTextLogger(
		'css-prefers-color-scheme',
		'Prefers Color Scheme',
		'Lets you use light and dark color schemes in all browsers, following the [Media Queries] specification.',
		{
			preserve: true,
			mediaQuery: 'color|color-index',
		},
	),
);
