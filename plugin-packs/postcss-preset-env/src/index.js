import autoprefixer from 'autoprefixer';
import cssdb from 'cssdb';
import writeToExports from './side-effects/write-to-exports.mjs';
import { pluginIdHelp } from './plugins/plugin-id-help.mjs';
import { dumpLogs, resetLogger } from './log/helper.mjs';
import logFeaturesList from './log/features-list.mjs';
import { listFeatures } from './lib/list-features.mjs';
import { initializeSharedOptions } from './lib/shared-options.mjs';

const plugin = (opts) => {
	// initialize options
	const options = Object(opts);
	const featureNamesInOptions = Object.keys(Object(options.features));
	const browsers = options.browsers;
	const sharedOptions = initializeSharedOptions(options);

	const features = listFeatures(cssdb, options, sharedOptions);
	const plugins = features.map((feature) => {
		return feature.plugin;
	});

	if (options.autoprefixer !== false) {
		plugins.push(
			autoprefixer(Object.assign({ overrideBrowserslist: browsers }, options.autoprefixer)),
		);
	}

	logFeaturesList(features, options);

	const internalPlugin = () => {
		return {
			postcssPlugin: 'postcss-preset-env',
			OnceExit: function (root, { result }) {
				pluginIdHelp(featureNamesInOptions, root, result);

				if (options.debug) {
					dumpLogs(result);
				}

				// Always reset the logger, if when debug is false
				resetLogger();

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
