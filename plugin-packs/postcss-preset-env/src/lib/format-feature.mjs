import getOptionsForBrowsersByFeature from './get-options-for-browsers-by-feature.mjs';
import getUnsupportedBrowsersByFeature from './get-unsupported-browsers-by-feature.mjs';
import { OUT_OF_RANGE_STAGE } from './stage.mjs';
import { insertAfterKey, insertBeforeKey, pluginKey } from '../own-keys/keys.mjs';
import { pluginsById } from '../plugins/plugins-by-id.mjs';

export function formatPolyfillableFeature(feature) {
	// target browsers for the polyfill
	const unsupportedBrowsers = getUnsupportedBrowsersByFeature(feature);
	if (feature[insertBeforeKey] || feature[insertAfterKey]) {
		let id = feature.id;
		if (feature.insertBefore) {
			id = `before-${id}`;
		} else {
			id = `after-${id}`;
		}

		return {
			browsers: unsupportedBrowsers,
			vendors_implementations: feature.vendors_implementations,
			plugin: feature[pluginKey],
			id: id,
			stage: OUT_OF_RANGE_STAGE + 1, // So they always match
		};
	}

	return {
		browsers: unsupportedBrowsers,
		vendors_implementations: feature.vendors_implementations,
		plugin: pluginsById.get(feature.id),
		id: feature.id,
		stage: feature.stage,
	};
}

export function formatStagedFeature(cssdbList, browsers, features, feature, sharedOptions, logger) {
	let options;
	let plugin;

	options = getOptionsForBrowsersByFeature(browsers, feature, cssdbList, logger);

	if (features[feature.id] === true) {
		if (sharedOptions) {
			options = Object.assign({}, options, sharedOptions);
		}
	} else {
		if (sharedOptions) {
			options = Object.assign({}, options, sharedOptions, features[feature.id]);
		} else {
			options = Object.assign({}, options, features[feature.id]);
		}
	}

	// postcss-preset-env : option overrides
	options.enableProgressiveCustomProperties = false;

	if (feature.plugin.postcss && typeof feature.plugin === 'function') {
		plugin = feature.plugin(options);
	} else if (feature.plugin && feature.plugin.default && typeof feature.plugin.default === 'function' && feature.plugin.default.postcss) {
		plugin = feature.plugin.default(options);
	} else {
		plugin = feature.plugin;
	}

	return {
		browsers: feature.browsers,
		vendors_implementations: feature.vendors_implementations,
		plugin: plugin,
		pluginOptions: options,
		id: feature.id,
	};
}
