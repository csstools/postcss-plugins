import plugin from '@csstools/postcss-media-minmax';
import { cli, helpTextLogger } from '@csstools/base-cli';

export default function postcssMediaMinMax() {
	cli(
		plugin,
		[],
		helpTextLogger(
			'@csstools/cli postcss-media-minmax',
			'PostCSS Media MinMax',
			'Lets you use the range notation in CSS media queries.',
			{},
		),
		false,
	);
}
