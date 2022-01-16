import autoprefixer from 'autoprefixer';
import browserslist from 'browserslist';
import cssdb from 'cssdb';
import { pluginsById as plugins } from './lib/plugins-by-id';
import getTransformedInsertions from './lib/get-transformed-insertions';
import getUnsupportedBrowsersByFeature from './lib/get-unsupported-browsers-by-feature';
import idsByExecutionOrder from './lib/ids-by-execution-order';
import writeToExports from './lib/write-to-exports';
import getOptionsForBrowsersByFeature from './lib/get-options-for-browsers-by-feature';
import { pluginIdHelp } from './lib/plugin-id-help';
import { pluginHasSideEffects } from './lib/plugins-with-side-effects';
import { log, dumpLogs, resetLogger } from './lib/log-helper';
import logFeaturesList from './lib/log-features-list';

const DEFAULT_STAGE = 2;
const OUT_OF_RANGE_STAGE = 5;

const plugin = opts => {
	// initialize options
	const options = Object(opts);
	const features = Object(options.features);
	const featureNamesInOptions = Object.keys(features);
	const insertBefore = Object(options.insertBefore);
	const insertAfter = Object(options.insertAfter);
	const browsers = options.browsers;
	let stage = DEFAULT_STAGE;

	resetLogger();

	if (typeof options.stage !== 'undefined') {
		if (options.stage === false) {
			stage = OUT_OF_RANGE_STAGE;
		} else {
			stage = Math.min(parseInt(options.stage, 10), OUT_OF_RANGE_STAGE) || 0;
		}
	}

	if (stage === OUT_OF_RANGE_STAGE) {
		log('Stage has been disabled, features will be handled via the "features" option.');
	} else {
		log(`Using features from Stage ${stage}`);
	}

	const autoprefixerOptions = options.autoprefixer;
	const sharedOpts = initializeSharedOpts(options);
	const stagedAutoprefixer = autoprefixerOptions === false
		? () => {}
		: autoprefixer(Object.assign({ overrideBrowserslist: browsers }, autoprefixerOptions));

	// polyfillable features (those with an available postcss plugin)
	const polyfillableFeatures = cssdb.concat(
		// additional features to be inserted before cssdb features
		getTransformedInsertions(insertBefore, 'insertBefore'),
		// additional features to be inserted after cssdb features
		getTransformedInsertions(insertAfter, 'insertAfter'),
	).filter(
		// inserted features or features with an available postcss plugin
		feature => feature.insertBefore || feature.id in plugins,
	).sort(
		// features sorted by execution order and then insertion order
		(a, b) => idsByExecutionOrder.indexOf(a.id) - idsByExecutionOrder.indexOf(b.id) || (a.insertBefore ? -1 : b.insertBefore ? 1 : 0) || (a.insertAfter ? 1 : b.insertAfter ? -1 : 0),
	).map(
		// polyfillable features as an object
		feature => {
			// target browsers for the polyfill
			const unsupportedBrowsers = getUnsupportedBrowsersByFeature(feature.caniuse);

			return feature.insertBefore || feature.insertAfter ? {
				browsers: unsupportedBrowsers,
				plugin:   feature.plugin,
				id:       `${feature.insertBefore ? 'before' : 'after'}-${feature.id}`,
				stage:    OUT_OF_RANGE_STAGE + 1, // So they always match
			} : {
				browsers: unsupportedBrowsers,
				plugin:   plugins[feature.id],
				id:       feature.id,
				stage:    feature.stage,
			};
		},
	);

	// staged features (those at or above the selected stage)
	const stagedFeatures = polyfillableFeatures.filter(feature => {
		const isAllowedStage = feature.stage >= stage;
		const isDisabled = features[feature.id] === false;
		const isAllowedFeature = features[feature.id] ? features[feature.id] : isAllowedStage;

		if (isDisabled) {
			log(`  ${feature.id} has been disabled by options`);
		} else if (!isAllowedStage) {
			if (isAllowedFeature) {
				log(`  ${feature.id} has been enabled by options`);
			} else {
				log(`  ${feature.id} with stage ${feature.stage} has been disabled`);
			}
		}

		return isAllowedFeature;
	}).map(
		feature => {
			let options;
			let plugin;

			options = getOptionsForBrowsersByFeature(browsers, feature);

			if (features[feature.id] === true) {
				// if the plugin is enabled
				options = sharedOpts ? Object.assign({}, options, sharedOpts) : undefined;
			} else {
				options = sharedOpts
					// if the plugin has shared options and individual options
					? Object.assign({}, options, sharedOpts, features[feature.id])
					// if the plugin has individual options
					: Object.assign({}, options, features[feature.id]);
			}

			if (feature.plugin.postcss) {
				plugin = feature.plugin(options);
			} else {
				plugin = feature.plugin;
			}

			return {
				browsers: feature.browsers,
				plugin: plugin,
				pluginOptions: options,
				id: feature.id,
			};
		},
	);

	// browsers supported by the configuration
	const supportedBrowsers = browserslist(browsers, { ignoreUnknownVersions: true });

	// - features supported by the stage
	// - features with `true` or with options
	// - required for the browsers
	// - having "importFrom" or "exportTo" options
	const supportedFeatures = stagedFeatures.filter((feature) => {
		if (feature.id in features) {
			return features[feature.id];
		}

		if (pluginHasSideEffects(feature)) {
			return true;
		}

		return supportedBrowsers.some((supportedBrowser) => {
			return browserslist(feature.browsers, {
				ignoreUnknownVersions: true,
			}).some((polyfillBrowser) => {
				return polyfillBrowser === supportedBrowser;
			});
		});
	});

	const usedPlugins = supportedFeatures.map(feature => feature.plugin);
	usedPlugins.push(stagedAutoprefixer);

	logFeaturesList(supportedFeatures, options);

	const internalPlugin = () => {
		return {
			postcssPlugin: 'postcss-preset-env',
			OnceExit: function (root, { result }) {
				pluginIdHelp(featureNamesInOptions, root, result);

				if (options.debug) {
					dumpLogs(result);
				}

				if (options.exportTo) {
					writeToExports(sharedOpts.exportTo, opts.exportTo);
				}
			},
		};
	};

	internalPlugin.postcss = true;

	return {
		postcssPlugin: 'postcss-preset-env',
		plugins: [...usedPlugins, internalPlugin()],
	};
};

const initializeSharedOpts = opts => {
	if ('importFrom' in opts || 'exportTo' in opts || 'preserve' in opts) {
		const sharedOpts = {};

		if ('importFrom' in opts) {
			sharedOpts.importFrom = opts.importFrom;
		}

		if ('exportTo' in opts) {
			sharedOpts.exportTo = {
				customMedia: {},
				customProperties: {},
				customSelectors: {},
			};
		}

		if ('preserve' in opts) {
			sharedOpts.preserve = opts.preserve;
		}

		return sharedOpts;
	}

	return false;
};

plugin.postcss = true;

export default plugin;
