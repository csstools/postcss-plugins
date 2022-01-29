import browserslist from 'browserslist';
import { pluginHasSideEffects } from '../side-effects/plugins.mjs';
import { log, resetLogger } from '../log/helper.mjs';
import { featuresWithClientSide } from '../client-side-polyfills/plugins.mjs';
import { stageFromOptions } from './stage.mjs';
import { prepareFeaturesList } from './prepare-features-list.mjs';
import { formatPolyfillableFeature, formatStagedFeature } from './format-feature.mjs';
import { clamp } from '../util/clamp.mjs';
import { intOrZero } from '../util/int-or-zero.mjs';

export function listFeatures(cssdbList, options, sharedOptions) {
	// initialize options
	const features = Object(options.features);
	const enableClientSidePolyfills = 'enableClientSidePolyfills' in options ? options.enableClientSidePolyfills : true;
	const insertBefore = Object(options.insertBefore);
	const insertAfter = Object(options.insertAfter);
	const browsers = options.browsers;

	// defaults to 0
	const minimumVendorImplementations = clamp(
		0, // 0 equals not setting this options
		intOrZero(options.minimumVendorImplementations),
		3, // There are currently only 3 vendors that are tracked (Blink, Webkit, Gecko)
	);

	resetLogger();

	if (minimumVendorImplementations > 0) {
		log(`Using features with ${minimumVendorImplementations} or more vendor implementations`);
	}

	const stage = stageFromOptions(options);

	// polyfillable features (those with an available postcss plugin)
	const polyfillableFeatures = prepareFeaturesList(cssdbList, insertBefore, insertAfter).map((feature) => {
		return formatPolyfillableFeature(feature);
	});

	// vendor implemented features (those implemented by at least N vendors)
	const vendorImplementedFeatures = polyfillableFeatures.filter((feature) => {
		if (minimumVendorImplementations === 0) {
			return true;
		}

		if ( minimumVendorImplementations < feature.vendors_implementations ) {
			return true;
		}

		log(`  ${feature.id} with ${feature.vendors_implementations} vendor implementations has been disabled`);
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
			log(`  ${feature.id} has been disabled by options`);
		} else if (!isAllowedStage) {
			if (isAllowedFeature) {
				log(`  ${feature.id} has been enabled by options`);
			} else {
				log(`  ${feature.id} with stage ${feature.stage} has been disabled`);
			}
		} else if (!isAllowedByType) {
			log(`  ${feature.id} has been disabled by "enableClientSidePolyfills: false".`);
		}

		return isAllowedFeature;
	}).map((feature) => {
		return formatStagedFeature(cssdbList, browsers, features, feature, sharedOptions);
	});

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

		const unsupportedBrowsers = browserslist(feature.browsers, {
			ignoreUnknownVersions: true,
		});

		const needsPolyfill = supportedBrowsers.some(supportedBrowser => {
			return unsupportedBrowsers.some(unsupportedBrowser => unsupportedBrowser === supportedBrowser);
		});

		if (!needsPolyfill) {
			log(`${feature.id} disabled due to browser support`);
		}

		return needsPolyfill;
	});

	return supportedFeatures;
}
