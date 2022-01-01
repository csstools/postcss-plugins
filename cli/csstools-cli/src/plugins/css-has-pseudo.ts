import plugin from 'css-has-pseudo';
import { cli, helpTextLogger } from '@csstools/base-cli';

export default function cssHasPseudo() {
	cli(
		plugin,
		['preserve'],
		helpTextLogger(
			'@csstools/cli css-has-pseudo',
			'PostCSS Has Pseudo',
			'Transforms CSS with :has {}',
			{
				preserve: true,
			},
		),
		false,
	);
}
