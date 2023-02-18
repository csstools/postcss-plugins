import type { CssSyntaxError } from 'postcss';

export function reduceInformationInCssSyntaxError(err: CssSyntaxError | TypeError): void {
	// Logging the full information from a CssSyntaxError can cause excessively large output.
	// We want to remove the embedded source CSS and PostCSS nodes from these objects.
	// This leaves the error message, stacktrace and CSS source position.
	if (!process.env.DEBUG) {
		// @ts-expect-error "source" is also added on "TypeError"
		delete err.source;
		// @ts-expect-error "input" is also added on "TypeError"
		if (err.input) {
			// @ts-expect-error "input" is also added on "TypeError"
			delete err.input.source;
		}

		// @ts-expect-error "postcssNode" is not included in the upstream type
		delete err.postcssNode;
	}
}
