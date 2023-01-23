export function initializeSharedOptions(opts) {
	if ('preserve' in opts) {
		const sharedOptions = {};
		sharedOptions.preserve = opts.preserve;
		return sharedOptions;
	}

	return false;
}
