import { browsersWithSupportStats } from './browsers-with-supports-stats.mjs';

// return a list of browsers that do not support the feature
export function getUnsupportedBrowsersByFeature(feature) {
	if (!feature) {
		return [];
	}

	if (!('browser_support' in feature)) {
		// the feature does not work in any browser (yet)
		return [ '> 0%' ];
	}

	const query = [];

	browsersWithSupportStats.forEach(browser => {
		if (browser === 'op_mini' && (typeof feature.browser_support[browser] === 'undefined')) {
			// Opera Mini is always "op_mini all"
			query.push('op_mini all');
			return;
		}

		const browserSupport = feature.browser_support[browser];
		// Browser support info must be a valid version.
		// TP or Beta versions are considered unsupported.
		const isValid = (typeof browserSupport === 'string') && (DIGITS_OR_DOTS_REGEX.test(browserSupport));
		if (isValid) {
			query.push(`${browser} < ${feature.browser_support[browser]}`);
		} else {
			query.push(`${browser} >= 1`);
		}
	});

	return query;
}

const DIGITS_OR_DOTS_REGEX = /^[0-9|.]+$/;
