import plugin from 'postcss-env-function';
import { cli, helpTextLogger } from '@csstools/base-cli';

export default function postcssEnvFunction() {
	cli(
		plugin,
		['importFrom'],
		helpTextLogger(
			'@csstools/cli postcss-env-function',
			'PostCSS Environment Variables',
			'Lets you use `env()` variables in CSS, following the CSS Environment Variables specification.',
			{
				importFrom: ['import-variables.js'],
			},
		),
		false,
	);
}
