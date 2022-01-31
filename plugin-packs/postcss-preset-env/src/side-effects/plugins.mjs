// Some plugins have side effects that go beyond the scope of preset-env.
// These plugins always need to run.
// IMPORTANT: this should be removed and cleaned up in a next major version.
export function pluginHasSideEffects(feature) {
	if ('importFrom' in Object(feature.pluginOptions)) {
		switch (feature.id) {
			case 'custom-media-queries':
				if (anyOptionFor(feature.pluginOptions.importFrom, 'customMedia')) {
					return true;
				}
				break;
			case 'custom-properties':
				if (anyOptionFor(feature.pluginOptions.importFrom, 'customProperties')) {
					return true;
				}
				break;
			case 'environment-variables':
				if (anyOptionFor(feature.pluginOptions.importFrom, 'environmentVariables')) {
					return true;
				}
				break;
			case 'custom-selectors':
				if (anyOptionFor(feature.pluginOptions.importFrom, 'customSelectors')) {
					return true;
				}
				break;

			default:
				break;
		}
	}

	if ('exportTo' in Object(feature.pluginOptions)) {
		switch (feature.id) {
			case 'custom-media-queries':
				if (anyOptionFor(feature.pluginOptions.exportTo, 'customMedia')) {
					return true;
				}
				break;
			case 'custom-properties':
				if (anyOptionFor(feature.pluginOptions.exportTo, 'customProperties')) {
					return true;
				}
				break;
			case 'environment-variables':
				if (anyOptionFor(feature.pluginOptions.exportTo, 'environmentVariables')) {
					return true;
				}
				break;
			case 'custom-selectors':
				if (anyOptionFor(feature.pluginOptions.exportTo, 'customSelectors')) {
					return true;
				}
				break;

			default:
				break;
		}
	}

	return false;
}

function anyOptionFor(opts, feature) {
	if (!opts) {
		return false;
	}

	if (typeof opts === 'string') {
		return true;
	}

	if (Array.isArray(opts)) {
		for (let i = 0; i < opts.length; i++) {
			if (typeof opts[i] === 'string') {
				return true;
			}

			if (opts[i] && (feature in Object(opts[i]))) {
				return true;
			}
		}

		return false;
	}

	if (feature in Object(opts)) {
		return true;
	}

	return false;
}
