import getOptionsForBrowsersByFeature from './get-options-for-browsers-by-feature.mjs';
import { getUnsupportedBrowsersByFeature } from './get-unsupported-browsers-by-feature.mjs';
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

export function formatStagedFeature(cssdbList, browsers, features, feature, sharedOptions, options, logger) {
	let pluginOption;
	let plugin;

	pluginOption = getOptionsForBrowsersByFeature(browsers, feature, cssdbList, options, logger);

	if (features[feature.id] === true) {
		if (sharedOptions) {
			pluginOption = Object.assign({}, pluginOption, sharedOptions);
		}
	} else {
		if (sharedOptions) {
			pluginOption = Object.assign({}, pluginOption, sharedOptions, features[feature.id]);
		} else {
			pluginOption = Object.assign({}, pluginOption, features[feature.id]);
		}
	}

	// postcss-preset-env : option overrides
	pluginOption.enableProgressiveCustomProperties = false;

	// https://github.com/maximkoretskiy/postcss-initial#replace
	if (feature.id === 'all-property' && 'preserve' in pluginOption) {
		pluginOption.replace = pluginOption.preserve;
	}

	// https://github.com/MattDiMu/postcss-replace-overflow-wrap/blob/ec9914e0b9473a75a5d1fe32ea4311555eb81b71/index.js#L10
	if (feature.id === 'overflow-wrap-property' && 'preserve' in pluginOption) {
		pluginOption.method = pluginOption.preserve ? 'copy' : 'replace';
	}

	if (feature.plugin.postcss && typeof feature.plugin === 'function') {
		plugin = feature.plugin(pluginOption);
	} else if (feature.plugin && feature.plugin.default && typeof feature.plugin.default === 'function' && feature.plugin.default.postcss) {
		plugin = feature.plugin.default(pluginOption);
	} else {
		plugin = feature.plugin;
	}

	return {
		browsers: feature.browsers,
		vendors_implementations: feature.vendors_implementations,
		plugin: plugin,
		pluginOptions: pluginOption,
		id: feature.id,
	};
}
