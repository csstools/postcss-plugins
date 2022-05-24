import plugin from '@csstools/postcss-cascade-layers';
import { cli, helpTextLogger } from '@csstools/base-cli';

export default function postcssCascadeLayers() {
	cli(
		plugin,
		[],
		helpTextLogger(
			'@csstools/cli postcss-cascade-layers',
			'PostCSS Cascade Layers',
			'Lets you use `@layer` following the Cascade Layers Specification.',
		),
		false,
	);
}
