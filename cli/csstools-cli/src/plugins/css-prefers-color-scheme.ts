import plugin from 'css-prefers-color-scheme';
import { cli, helpTextLogger } from '@csstools/base-cli';

export default function cssPrefersColorScheme() {
	cli(
		plugin,
		['preserve', 'mediaQuery'],
		helpTextLogger(
			'@csstools/cli css-prefers-color-scheme',
			'Prefers Color Scheme',
			'Lets you use light and dark color schemes in all browsers, following the Media Queries specification.',
			{
				preserve: true,
				mediaQuery: 'color|color-index',
			},
		),
		false,
	);
}
