
export function initializeSharedOptions(opts) {
	if ('preserve' in opts) {
		const sharedOptions = {};

		if ('preserve' in opts) {
			sharedOptions.preserve = opts.preserve;
		}

		return sharedOptions;
	}

	return false;
}
