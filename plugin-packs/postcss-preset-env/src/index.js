import autoprefixer from 'autoprefixer';
import cssdb from 'cssdb';
import logFeaturesList from './log/features-list.mjs';
import postcssProgressiveCustomProperties from '@csstools/postcss-progressive-custom-properties';
import writeToExports from './side-effects/write-to-exports.mjs';
import { initializeSharedOptions } from './lib/shared-options.mjs';
import { listFeatures } from './lib/list-features.mjs';
import { newLogger } from './log/helper.mjs';
import { pluginIdHelp } from './plugins/plugin-id-help.mjs';


const plugin = (opts) => {
	const logger = newLogger();

	// initialize options
	const options = Object(opts);
	const featureNamesInOptions = Object.keys(Object(options.features));
	const browsers = options.browsers;
	const sharedOptions = initializeSharedOptions(options);

	const features = listFeatures(cssdb, options, sharedOptions, logger);
	const plugins = features.map((feature) => {
		return feature.plugin;
	});

	if (options.autoprefixer !== false) {
		plugins.push(
			autoprefixer(Object.assign({ overrideBrowserslist: browsers }, options.autoprefixer)),
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

				if (options.exportTo) {
					writeToExports(sharedOptions.exportTo, opts.exportTo);
				}
			},
		};
	};

	internalPlugin.postcss = true;

	return {
		postcssPlugin: 'postcss-preset-env',
		plugins: [...plugins, internalPlugin()],
	};
};

plugin.postcss = true;

export default plugin;
