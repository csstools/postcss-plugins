import browserslist from 'browserslist';
import getUnsupportedBrowsersByFeature from './get-unsupported-browsers-by-feature.mjs';

// add extra options for certain browsers by feature
export default function getOptionsForBrowsersByFeature(browsers, feature, cssdbList, logger) {
	const supportedBrowsers = browserslist(browsers, { ignoreUnknownVersions: true });

	switch (feature.id) {
		case 'is-pseudo-class':
			// Emit a warning to avoid making unresolved removal of `:is()` a feature.
			// see : https://github.com/csstools/postcss-plugins/tree/main/plugins/postcss-is-pseudo-class#%EF%B8%8F-known-shortcomings
			return {
				onComplexSelector: 'warning',
			};
		case 'nesting-rules':
			{
				// Nesting rules can transform selectors to use :is pseudo.
				// This is more spec compliant but it's not supported by all browsers.
				// If we can't use :is pseudo according to preset-env options, we add an extra option to avoid :is pseudo.
				const feature = cssdbList.find(feature => feature.id === 'is-pseudo-class');

				if (needsOptionFor(feature, supportedBrowsers)) {
					logger.log('Disabling :is on "nesting-rules" due to lack of browser support.');
					return {
						noIsPseudoSelector: true,
					};
				}
			}

			return {};

		case 'any-link-pseudo-class':
			{
				const hasIEOrEdge = supportedBrowsers.find((browserslistEntry) => {
					return browserslistEntry.startsWith('ie ') || browserslistEntry.startsWith('edge ');
				});

				if (hasIEOrEdge) {
					logger.log('Adding area[href] fallbacks for ":any-link" support in Edge and IE.');
					return {
						subFeatures: {
							areaHrefNeedsFixing: true,
						},
					};
				}
			}

			return {};

		default:
			return {};
	}
}

function needsOptionFor(feature, supportedBrowsers) {
	const unsupportedIn = getUnsupportedBrowsersByFeature(feature);

	if (supportedBrowsers.some(
		supportedBrowser => browserslist(unsupportedIn, {
			ignoreUnknownVersions: true,
		}).some(
			polyfillBrowser => polyfillBrowser === supportedBrowser,
		),
	)) {
		return true;
	}

	return false;
}
