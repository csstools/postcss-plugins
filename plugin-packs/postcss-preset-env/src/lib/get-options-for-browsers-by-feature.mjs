// add extra options for certain browsers by feature
export default function getOptionsForBrowsersByFeature(supportedBrowsers, feature, options, logger) {
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
