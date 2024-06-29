/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */

import autoprefixer from 'autoprefixer';
import cssdb from 'cssdb';
import logFeaturesList from './log/features-list.mjs';
import { initializeSharedOptions } from './lib/shared-options.mjs';
import { listFeatures } from './lib/list-features.mjs';
import { newLogger } from './log/helper.mjs';
import { pluginIdHelp } from './plugins/plugin-id-help.mjs';
import type { pluginOptions } from './options';
import type { PluginCreator } from 'postcss';
export type { pluginOptions, DirectionFlow } from './options';
export type { pluginsOptions, subPluginOptions } from './plugins/plugins-options';
export type { postcssClampOptions } from './types/postcss-clamp/plugin-options';
export type { postcssFontFamilySystemUIOptions } from './types/postcss-system-ui-font-family/plugin-options';
export type { postcssFontVariantOptions } from './types/postcss-font-variant/plugin-options';
export type { postcssOpacityPercentageOptions } from './types/postcss-opacity-percentage/plugin-options';
export type { postcssPageBreakOptions } from './types/postcss-page-break/plugin-options';
export type { postcssReplaceOverflowWrapOptions } from './types/postcss-replace-overflow-wrap/plugin-options';

const creator: PluginCreator<pluginOptions> = (opts?: pluginOptions) => {
	const logger = newLogger();

	// initialize options
	const options = Object(opts);
	const featureNamesInOptions = Object.keys(Object(options.features));
	const env = options.browsers ? undefined : options.env; // When `browsers` is set, ignore `env`
	const browsers = options.browsers;
	const sharedOptions = initializeSharedOptions(options);

	const features = listFeatures(cssdb, options, sharedOptions, logger);
	const plugins = features.map((feature) => feature.plugin);

	if (options.autoprefixer !== false) {
		plugins.push(
			autoprefixer(Object.assign({ env: env, overrideBrowserslist: browsers }, options.autoprefixer)),
		);
	}

	logFeaturesList(features, options, logger);

	const internalPlugin: PluginCreator<never> = () => {
		return {
			postcssPlugin: 'postcss-preset-env',
			OnceExit(root, { result }): void {
				pluginIdHelp(featureNamesInOptions, root, result);

				if (options.debug) {
					logger.emitLogs(result);
				}

				// Always reset the logger, even when debug is false
				logger.resetLogger();
			},
		};
	};

	internalPlugin.postcss = true;

	return {
		postcssPlugin: 'postcss-preset-env',
		plugins: [...plugins, internalPlugin()],
	};
};

creator.postcss = true;

export default creator;
