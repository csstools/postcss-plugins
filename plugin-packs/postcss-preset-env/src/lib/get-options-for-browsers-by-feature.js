import browserslist from 'browserslist';
import getUnsupportedBrowsersByFeature from './get-unsupported-browsers-by-feature';
import { log } from './log-helper';

// add extra options for certain browsers by feature
export default function getOptionsForBrowsersByFeature(browsers, feature, cssdb) {
	const supportedBrowsers = browserslist(browsers, { ignoreUnknownVersions: true });

	switch (feature.id) {
		case 'nesting-rules':
			{
				// Nesting rules can transform selectors to use :is pseudo.
				// This is more spec compliant but it's not supported by all browsers.
				// If we can't use :is pseudo according to preset-env options, we add an extra option to avoid :is pseudo.
				const feature = cssdb.find(feature => feature.id === 'is-pseudo-class');

				if (needsOptionFor(feature, supportedBrowsers)) {
					log('Disabling :is on "nesting-rules" due to lack of browser support.');
					return {
						noIsPseudoSelector: true,
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
