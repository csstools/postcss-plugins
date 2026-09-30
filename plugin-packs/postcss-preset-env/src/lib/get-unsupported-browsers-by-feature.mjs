import { browsersWithSupportStats } from './browsers-with-supports-stats.mjs';

// return a list of browsers that do not support the feature
export function getUnsupportedBrowsersByFeature(feature) {
	if (!feature) {
		return [];
	}

	if (feature.id === 'position-area-property') {
		// https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Properties/position-area#browser_compatibility
		// this can't be expressed in CSSDB
		return [
			'chrome 125',
			'chrome 126',
			'chrome 127',
			'chrome 128',
			'edge 125',
			'edge 126',
			'edge 127',
			'edge 128',
			'and_chr 125',
			'and_chr 126',
			'and_chr 127',
			'and_chr 128',
			'android 125',
			'android 126',
			'android 127',
			'android 128',

			'samsung 27',

			'opera 111',
			'opera 112',
			'opera 113',
			'opera 114',
			'op_mob 83',
			'op_mob 84',
			'op_mob 85',
		];
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
