// Some plugins have side effects that go beyond the scope of preset-env.
// These plugins always need to run.
// IMPORTANT: this should be removed and cleanup in a next major version.
export function pluginHasSideEffects(feature) {
	if ('importFrom' in feature.pluginOptions) {
		switch (feature.id) {
			case 'custom-media-queries':
				if (Object.keys(Object(feature.pluginOptions.importFrom.customMedia)).length) {
					return true;
				}
				break;
			case 'custom-properties':
				if (Object.keys(Object(feature.pluginOptions.importFrom.customProperties)).length) {
					return true;
				}
				break;
			case 'environment-variables':
				if (Object.keys(Object(feature.pluginOptions.importFrom.environmentVariables)).length) {
					return true;
				}
				break;
			case 'custom-selectors':
				if (Object.keys(Object(feature.pluginOptions.importFrom.customSelectors)).length) {
					return true;
				}
				break;

			default:
				break;
		}
	}

	if ('exportTo' in feature.pluginOptions) {
		switch (feature.id) {
			case 'custom-media-queries':
				if (Object.keys(Object(feature.pluginOptions.exportTo.customMedia)).length) {
					return true;
				}
				break;
			case 'custom-properties':
				if (Object.keys(Object(feature.pluginOptions.exportTo.customProperties)).length) {
					return true;
				}
				break;
			case 'environment-variables':
				if (Object.keys(Object(feature.pluginOptions.exportTo.environmentVariables)).length) {
					return true;
				}
				break;
			case 'custom-selectors':
				if (Object.keys(Object(feature.pluginOptions.exportTo.customSelectors)).length) {
					return true;
				}
				break;

			default:
				break;
		}
	}

	return false;
}
