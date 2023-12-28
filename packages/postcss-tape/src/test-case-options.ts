import type { Plugin } from 'postcss';

/**
 * Options for a test case.
 */
export interface TestCaseOptions {
	/** Debug message */
	message?: string,
	/** Plugin options. Only used if `plugins` is not specified. */
	options?: unknown,
	/** Plugins to use. When specified the original plugin is not used. */
	plugins?: Array<Plugin>,
	/** The expected number of warnings. */
	warnings?: number,
	/** Expected exception */
	exception?: RegExp,

	/** Override the file name of the "source" file. */
	source?: string,
	/** Override the file name of the "expect" file. */
	expect?: string,
	/** Override the file name of the "result" file. */
	result?: string,

	/** Do something before the test is run. */
	before?: () => void | Promise<void>,
	/** Do something after the test is run. */
	after?: () => void | Promise<void>,
}
