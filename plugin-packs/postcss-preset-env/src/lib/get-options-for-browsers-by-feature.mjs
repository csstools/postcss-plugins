// add extra options for certain browsers by feature
export default function getOptionsForBrowsersByFeature(supportedBrowsers, feature, cssdbList, options, logger) {
	switch (feature.id) {
		case 'is-pseudo-class':
			// Emit a warning to avoid making unresolved removal of `:is()` a feature.
			// see : https://github.com/csstools/postcss-plugins/tree/main/plugins/postcss-is-pseudo-class#%EF%B8%8F-known-shortcomings
			return {
				onComplexSelector: 'warning',
			};
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
		case 'logical-properties-and-values':
		case 'float-clear-logical-values':
		case 'logical-resize':
		case 'logical-viewport-units':
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
