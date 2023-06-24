import autoprefixer from 'autoprefixer';
import cssdb from 'cssdb';
import logFeaturesList from './log/features-list.mjs';
import postcssProgressiveCustomProperties from '@csstools/postcss-progressive-custom-properties';
import { initializeSharedOptions } from './lib/shared-options.mjs';
import { listFeatures } from './lib/list-features.mjs';
import { newLogger } from './log/helper.mjs';
import { pluginIdHelp } from './plugins/plugin-id-help.mjs';
import type { pluginOptions } from './options';
import type { PluginCreator } from 'postcss';
export type { pluginOptions } from './options';

const creator: PluginCreator<pluginOptions> = (opts?: pluginOptions) => {
	const logger = newLogger();

	// initialize options
	const options = Object(opts);
	const featureNamesInOptions = Object.keys(Object(options.features));
	const env = options.env;
	const browsers = options.browsers;
	const sharedOptions = initializeSharedOptions(options);

	const features = listFeatures(cssdb, options, sharedOptions, logger);
	const plugins = features.map((feature) => feature.plugin);

	if (options.autoprefixer !== false) {
		plugins.push(
			autoprefixer(Object.assign({ env, overrideBrowserslist: browsers }, options.autoprefixer)),
		);
	}

	plugins.push(
		postcssProgressiveCustomProperties(),
	);

	logFeaturesList(features, options, logger);

	const internalPlugin = () => {
		return {
			postcssPlugin: 'postcss-preset-env',
			OnceExit: function (root, { result }) {
				pluginIdHelp(featureNamesInOptions, root, result);

				if (options.debug) {
					logger.dumpLogs(result);
				}

				// Always reset the logger, if when debug is false
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
