import plugin from 'postcss-preset-env';
import { cli, helpTextLogger } from '@csstools/base-cli';

export default function postcssPresetEnv() {
	cli(
		plugin,
		[
			'stage',
			'minimumVendorImplementations',
			'features',
			'browsers',
			'autoprefixer',
			'preserve',
			'importFrom',
			'exportTo',
			'enableClientSidePolyfills',
		],
		helpTextLogger(
			'@csstools/cli postcss-preset-env',
			'PostCSS Preset Env',
			'Lets you convert modern CSS into something most browsers can understand, determining the polyfills you need based on your targeted browsers or runtime environments.',
			{
				stage: 0,
				minimumVendorImplementations: 2,
				features: {
					'blank-pseudo-class': { preserve: false },
					'color-functional-notation': { preserve: true },
				},
				browsers: 'last 2 versions',
				autoprefixer: { grid: true },
				preserve: false,
				importFrom: 'path/to/file.css',
				exportTo: 'path/to/file.css',
				enableClientSidePolyfills: false,
			},
		),
		false,
	);
}
