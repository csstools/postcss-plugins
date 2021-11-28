export const handleInvalidation = (opts, message, word) => {
	if (opts.oninvalid === 'warn') {
		opts.decl.warn(opts.result, message, { word: String(word) });
	} else if (opts.oninvalid === 'throw') {
		throw opts.decl.error(message, { word: String(word) });
	}
};
