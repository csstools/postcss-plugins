import plugin from '@csstools/postcss-logical-float-and-clear';
import { cli, helpTextLogger } from '@csstools/base-cli';

export default function postcssLogical(): void {
	cli(
		plugin,
		['inlineDirection', 'blockDirection'],
		helpTextLogger(
			'@csstools/cli postcss-logical-float-and-clear',
			'PostCSS Logical Float And Clear',
			'Lets you use flow-relative (inline-start and inline-end) values for float and clear, following the CSS Logical Properties and Values specification.',
			{
				inlineDirection: 'left-to-right',
			},
		),
		false,
	);
}
