import browserslist from 'browserslist';
import { featuresWithClientSide } from '../client-side-polyfills/plugins.mjs';
import { stageFromOptions } from './stage.mjs';
import { prepareFeaturesList } from './prepare-features-list.mjs';
import { formatPolyfillableFeature, formatStagedFeature } from './format-feature.mjs';
import { clamp } from '../util/clamp.mjs';
import { intOrZero } from '../util/int-or-zero.mjs';
import { insertAfterKey, insertBeforeKey } from '../own-keys/keys.mjs';
import { browsersWithSupportStats } from './browsers-with-supports-stats.mjs';

const alwaysEnabled = new Set([
	'progressive-custom-properties',
]);

export function listFeatures(cssdbList, options, sharedOptions, logger) {
	// initialize options
	const features = Object(options.features);
	const enableClientSidePolyfills = 'enableClientSidePolyfills' in options ? options.enableClientSidePolyfills : false;
	const insertBefore = Object(options.insertBefore);
	const insertAfter = Object(options.insertAfter);
	const env = options.browsers ? undefined : options.env; // When `browsers` is set, ignore `env`
	const browsers = options.browsers;

	// defaults to 0
	const minimumVendorImplementations = clamp(
		0, // 0 equals not setting this options
		intOrZero(options.minimumVendorImplementations),
		3, // There are currently only 3 vendors that are tracked (Blink, Webkit, Gecko)
	);

	if (minimumVendorImplementations > 0) {
		logger.log(`Using features with ${minimumVendorImplementations} or more vendor implementations`);
	}

	const stage = stageFromOptions(options, logger);

	// polyfillable features (those with an available postcss plugin)
	const polyfillableFeatures = prepareFeaturesList([
		...cssdbList,
		{
			id: 'progressive-custom-properties',
		},
	], insertBefore, insertAfter).map((feature) => {
		return formatPolyfillableFeature(feature);
	});

	// vendor implemented features (those implemented by at least N vendors)
	const vendorImplementedFeatures = polyfillableFeatures.filter((feature) => {
		if (alwaysEnabled.has(feature.id)) {
			return true;
		}

		if (minimumVendorImplementations === 0) {
			return true;
		}

		if (feature[insertBeforeKey] || feature[insertAfterKey]) {
			return true;
		}

		if (minimumVendorImplementations <= feature.vendors_implementations) {
			return true;
		}

		if (featureEnabledByOptions(features, feature.id) === true) {
			// feature is explicitly enabled
			logger.log(`  ${feature.id} does not meet the required vendor implementations but has been enabled by options`);
			return true;
		}

		logger.log(`  ${feature.id} with ${feature.vendors_implementations} vendor implementations has been disabled`);
		return false;
	});

	// browsers supported by the configuration
	const supportedBrowsers = browserslist(browsers, { env: env, ignoreUnknownVersions: true }).filter((x) => {
		return browsersWithSupportStats.includes(x.split(' ')[0]);
	});

	// staged features (those at or above the selected stage)
	const stagedFeatures = vendorImplementedFeatures.filter((feature) => {
		if (alwaysEnabled.has(feature.id)) {
			return true;
		}

		// TODO : this filter needs to be split up.
		const isAllowedStage = feature.stage >= stage;
		const isAllowedByType = enableClientSidePolyfills || !featuresWithClientSide.includes(feature.id);
		const enabledByOptions = featureEnabledByOptions(features, feature.id);
		const isDisabled = enabledByOptions === false;
		const isAllowedFeature = enabledByOptions === true ? true : isAllowedStage && isAllowedByType;

		if (isDisabled) {
			logger.log(`  ${feature.id} has been disabled by options`);
		} else if (!isAllowedStage) {
			if (isAllowedFeature) {
				logger.log(`  ${feature.id} does not meet the required stage but has been enabled by options`);
			} else {
				logger.log(`  ${feature.id} with stage ${feature.stage} has been disabled`);
			}
		} else if (!isAllowedByType) {
			logger.log(`  ${feature.id} has been disabled by "enableClientSidePolyfills: false".`);
		}

		return !isDisabled && isAllowedFeature;
	}).map((feature) => {
		return formatStagedFeature(cssdbList, supportedBrowsers, features, feature, sharedOptions, options, logger);
	});

	// - features supported by the stage
	// - features with `true` or with options
	// - required for the browsers
	const supportedFeatures = stagedFeatures.filter((feature) => {
		if (alwaysEnabled.has(feature.id)) {
			return true;
		}

		const enabledByOptions = featureEnabledByOptions(features, feature.id);
		if (enabledByOptions === true || enabledByOptions === false) {
			return enabledByOptions;
		}

		const unsupportedBrowsers = browserslist(feature.browsers, {
			ignoreUnknownVersions: true,
		});

		const needsPolyfill = supportedBrowsers.some(supportedBrowser => {
			return unsupportedBrowsers.some(unsupportedBrowser => unsupportedBrowser === supportedBrowser);
		});

		if (!needsPolyfill) {
			logger.log(`${feature.id} disabled due to browser support`);
		}

		return needsPolyfill;
	});

	return supportedFeatures;
}

function featureEnabledByOptions(features, featureId) {
	if (!(featureId in features)) {
		return 'auto';
	}

	const value = features[featureId];
	if (Array.isArray(value)) {
		if (value[0] === true) {
			return true;
		}

		if (value[0] === false) {
			return false;
		}

		return 'auto';
	}

	return Boolean(value);
}
