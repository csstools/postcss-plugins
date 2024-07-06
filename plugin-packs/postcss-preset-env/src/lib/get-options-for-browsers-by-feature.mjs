import browserslist from 'browserslist';
import { getUnsupportedBrowsersByFeature } from './get-unsupported-browsers-by-feature.mjs';

// add extra options for certain browsers by feature
export default function getOptionsForBrowsersByFeature(supportedBrowsers, feature, cssdbList, options, logger) {
	switch (feature.id) {
		case 'is-pseudo-class':
			// Emit a warning to avoid making unresolved removal of `:is()` a feature.
			// see : https://github.com/csstools/postcss-plugins/tree/main/plugins/postcss-is-pseudo-class#%EF%B8%8F-known-shortcomings
			return {
				onComplexSelector: 'warning',
			};
		case 'nesting-rules':
			{
				// TODO : remove this in a next major release

				// Nesting rules can transform selectors to use :is pseudo.
				// This is more spec compliant but it's not supported by all browsers.
				// If we can't use :is pseudo according to preset-env options, we add an extra option to avoid :is pseudo.
				const feature = cssdbList.find(feature => feature.id === 'is-pseudo-class');

				if (needsOptionFor(feature, supportedBrowsers)) {
					logger.log('- \'nesting-rules\' setting \'noIsPseudoSelector: true\' due to lack of browser support for \':is()\'.');
					return {
						noIsPseudoSelector: true,
					};
				}
			}

			return {};

		case 'any-link-pseudo-class':
			{
				const hasIEOrEdge = supportedBrowsers.find((browserslistEntry) => {
					return browserslistEntry.startsWith('ie ') ||
						browserslistEntry === 'edge 12' ||
						browserslistEntry === 'edge 13' ||
						browserslistEntry === 'edge 14' ||
						browserslistEntry === 'edge 15' ||
						browserslistEntry === 'edge 16' ||
						browserslistEntry === 'edge 17' ||
						browserslistEntry === 'edge 18';
				});

				if (hasIEOrEdge) {
					logger.log('- \'any-link-pseudo-class\' setting \'subFeatures: { areaHrefNeedsFixing: true }\' due to lack of browser support for area[href] in Edge and IE.');
					return {
						subFeatures: {
							areaHrefNeedsFixing: true,
						},
					};
				}
			}

			return {};
		case 'logical-properties-and-values':
		case 'float-clear-logical-values':
		case 'logical-resize':
		case 'logical-viewport-units':
		case 'logical-overflow':
		case 'logical-overscroll-behavior':
			{
				if ('logical' in options) {
					return options.logical;
				}
			}

			return {};

		default:
			return {};
	}
}

function needsOptionFor(feature, supportedBrowsers) {
	const unsupportedIn = getUnsupportedBrowsersByFeature(feature);
	const unsupportedBrowsers = browserslist(unsupportedIn, {
		ignoreUnknownVersions: true,
	});

	if (supportedBrowsers.some((supportedBrowser) => {
		return unsupportedBrowsers.some(polyfillBrowser => polyfillBrowser === supportedBrowser);
	})) {
		return true;
	}

	return false;
}
