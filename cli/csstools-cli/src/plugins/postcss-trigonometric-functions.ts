import plugin from '@csstools/postcss-trigonometric-functions';
import { cli, helpTextLogger } from '@csstools/base-cli';

export default function postcssTrigonometricFunctions() {
	cli(
		plugin,
		['preserve'],
		helpTextLogger(
			'@csstools/cli postcss-trigonometric-functions',
			'PostCSS Trigonometric Functions',
			'Lets you use `sin`, `cos`, `tan`, `asin`, `acos`, `atan` and `atan2` to be able to compute trigonometric relationships following the CSS Values 4 specification.',
			{
				preserve: true,
			},
		),
		false,
	);
}
