export function reduceInformationInCssSyntaxError(err): void {
	// Logging the full information from a CssSyntaxError can cause excessively large output.
	// We want to remove the embedded source CSS and PostCSS nodes from these objects.
	// This leaves the error message, stacktrace and CSS source position.
	if (err.name === 'CssSyntaxError' && !process.env.DEBUG) {
		delete err.source;
		if (err.input) {
			delete err.input.source;
		}

		delete err.postcssNode;
	}
}
