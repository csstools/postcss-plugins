import plugin from '@csstools/postcss-scope-pseudo-class';
import { cli, helpTextLogger } from '@csstools/base-cli';

export default function postcssScopePseudoClass(): void {
	cli(
		plugin,
		['preserve'],
		helpTextLogger(
			'@csstools/cli postcss-scope-pseudo-class',
			'PostCSS Scope Pseudo Class',
			'Lets you use the Reference Element Pseudo-class: :scope.',
			{
				preserve: true,
			},
		),
		false,
	);
}
