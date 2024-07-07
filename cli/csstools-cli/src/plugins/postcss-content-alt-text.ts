import plugin from '@csstools/postcss-content-alt-text';
import { cli, helpTextLogger } from '@csstools/base-cli';

export default async function postcssContentAltText(): Promise<void> {
	await cli(
		plugin,
		['preserve', 'stripAltText', 'enableProgressiveCustomProperties'],
		helpTextLogger(
			'@csstools/cli postcss-content-alt-text',
			'PostCSS Content Alt Text',
			'Generate fallback values for content with alt text.',
			{
				preserve: true,
				stripAltText: false,
				enableProgressiveCustomProperties: true,
			},
		),
		false,
	);
}
