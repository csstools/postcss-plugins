import plugin from 'postcss-selector-not';
import { cli, helpTextLogger } from '@csstools/base-cli';

export default function postcssSelectorNot() {
	cli(
		plugin,
		[],
		helpTextLogger(
			'@csstools/cli postcss-selector-not',
			'PostCSS Selector Not',
			'Transforms :not() W3C CSS level 4 pseudo classes to :not() CSS level 3 selectors following the Selectors 4 Specification',
		),
		false,
	);
}
