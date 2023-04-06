import plugin from '@csstools/postcss-media-queries-aspect-ratio-number-values';
import { cli, helpTextLogger } from '@csstools/base-cli';

export default function postcssMediaQueriesAspectRatioNumberValues() {
	cli(
		plugin,
		[],
		helpTextLogger(
			'@csstools/cli postcss-media-queries-aspect-ratio-number-values',
			'PostCSS Media Queries Aspect-Ratio Number Values',
			'Lets you use number values in aspect-ratio media queries.',
			{},
		),
		false,
	);
}
