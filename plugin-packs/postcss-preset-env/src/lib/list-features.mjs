import browserslist from 'browserslist';
import { featuresWithClientSide } from '../client-side-polyfills/plugins.mjs';
import { stageFromOptions } from './stage.mjs';
import { prepareFeaturesList } from './prepare-features-list.mjs';
import { formatPolyfillableFeature, formatStagedFeature } from './format-feature.mjs';
import { clamp } from '../util/clamp.mjs';
import { intOrZero } from '../util/int-or-zero.mjs';
import { insertAfterKey, insertBeforeKey } from '../own-keys/keys.mjs';

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
	const polyfillableFeatures = prepareFeaturesList(cssdbList, insertBefore, insertAfter).map((feature) => {
		return formatPolyfillableFeature(feature);
	});

	// vendor implemented features (those implemented by at least N vendors)
	const vendorImplementedFeatures = polyfillableFeatures.filter((feature) => {
		if (minimumVendorImplementations === 0) {
			return true;
		}

		if (feature[insertBeforeKey] || feature[insertAfterKey]) {
			return true;
		}

		if (minimumVendorImplementations <= feature.vendors_implementations) {
			return true;
		}

		if (features[feature.id]) {
			// feature is explicitly enabled
			logger.log(`  ${feature.id} does not meet the required vendor implementations but has been enabled by options`);
			return true;
		}

		logger.log(`  ${feature.id} with ${feature.vendors_implementations} vendor implementations has been disabled`);
		return false;
	});

	// staged features (those at or above the selected stage)
	const stagedFeatures = vendorImplementedFeatures.filter((feature) => {
		// TODO : this filter needs to be split up.
		const isAllowedStage = feature.stage >= stage;
		const isAllowedByType = enableClientSidePolyfills || !featuresWithClientSide.includes(feature.id);
		const isDisabled = features[feature.id] === false;
		const isAllowedFeature = features[feature.id] ? features[feature.id] : isAllowedStage && isAllowedByType;

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

		return isAllowedFeature;
	}).map((feature) => {
		return formatStagedFeature(cssdbList, browsers, features, feature, sharedOptions, options, logger);
	});

	// browsers supported by the configuration
	const supportedBrowsers = browserslist(browsers, { env: env, ignoreUnknownVersions: true });

	// - features supported by the stage
	// - features with `true` or with options
	// - required for the browsers
	const supportedFeatures = stagedFeatures.filter((feature) => {
		if (feature.id in features) {
			return features[feature.id];
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
