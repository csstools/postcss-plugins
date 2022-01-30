
export function initializeSharedOptions(opts) {
	if ('importFrom' in opts || 'exportTo' in opts || 'preserve' in opts) {
		const sharedOptions = {};

		if ('importFrom' in opts) {
			sharedOptions.importFrom = opts.importFrom;
		}

		if ('exportTo' in opts) {
			sharedOptions.exportTo = {
				customMedia: {},
				customProperties: {},
				customSelectors: {},
			};
		}

		if ('preserve' in opts) {
			sharedOptions.preserve = opts.preserve;
		}

		return sharedOptions;
	}

	return false;
}
