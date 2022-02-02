import plugin from '@csstools/postcss-font-format-keywords';
import { cli, helpTextLogger } from '@csstools/base-cli';

export default function postcssFontFormatKeywords() {
	cli(
		plugin,
		['preserve'],
		helpTextLogger(
			'@csstools/cli postcss-font-format-keywords',
			'PostCSS Font Format Keyword',
			'Lets you use unquoted format on @font-face CSS definitions.',
			{
				preserve: true,
			},
		),
		false,
	);
}
