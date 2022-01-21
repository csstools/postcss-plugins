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
	// if feature support can be determined
	if (feature.browser_support) {
		const query = [];

		browsers.forEach(browser => {
			const browserSupport = feature.browser_support[browser];
			// If the version is something like TP we can't do < TP
			const isValid = typeof browserSupport === 'string' && browserSupport.match(/^[0-9|.]+$/) !== null;

			if (isValid) {
				query.push(`${browser} < ${feature.browser_support[browser]}`);
			} else {
				query.push(`${browser} >= 1`);
			}
		});

		return query;
	} else {
		// otherwise, return that the feature does not work in any browser
		return [ '> 0%' ];
	}
}
