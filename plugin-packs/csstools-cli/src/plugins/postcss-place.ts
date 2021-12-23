import plugin from 'postcss-place';
import { cli, helpTextLogger } from '@csstools/base-cli';

export default function postcssPlace() {
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
		false,
	);
}
