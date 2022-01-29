const browsers = [
	'ie',
	'edge',
	'firefox',
	'chrome',
	'safari',
	'opera',
	'ios_saf',
	'android',
	'op_mob',
	'and_chr',
	'and_ff',
	'and_uc',
	'samsung',
	'and_qq',
	'baidu',
	'kaios',
];

// return a list of browsers that do not support the feature
export default function getUnsupportedBrowsersByFeature(feature) {
	if (!feature) {
		return [];
	}

	if (!('browser_support' in feature)) {
		// the feature does not work in any browser (yet)
		return [ '> 0%' ];
	}

	const query = [];

	browsers.forEach(browser => {
		const browserSupport = feature.browser_support[browser];
		// Browser support info must be a valid version.
		// TP or Beta versions are considered unsupported.
		const isValid = (typeof browserSupport === 'string') && (/^[0-9|.]+$/.test(browserSupport));
		if (isValid) {
			query.push(`${browser} < ${feature.browser_support[browser]}`);
		} else {
			query.push(`${browser} >= 1`);
		}
	});

	return query;
}
