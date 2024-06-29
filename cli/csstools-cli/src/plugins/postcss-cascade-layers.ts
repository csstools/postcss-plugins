import plugin from '@csstools/postcss-cascade-layers';
import { cli, helpTextLogger } from '@csstools/base-cli';

export default async function postcssCascadeLayers(): Promise<void> {
	await cli(
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
