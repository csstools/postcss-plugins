import { DEFAULT_CONDITION, DEFAULT_FUNCTION_NAME } from './constants';

export type pluginOptions = {
	is?: Array<string>
	functionName: string,
	unitsAndValues?: {
		rootFontSize?: number
	}
}

export type parsedPluginOptions = {
	is: Array<string>,
	functionName: string,
	unitsAndValues: {
		rootFontSize: number
	}
}

export function parsePluginOptions(opts?: pluginOptions): parsedPluginOptions {
	const options: parsedPluginOptions = {
		is: [DEFAULT_CONDITION],
		functionName: DEFAULT_FUNCTION_NAME,
		unitsAndValues: {
			rootFontSize: 16,
		},
	};

	if (!opts) {
		return options;
	}

	if (typeof opts !== 'object') {
		return options;
	}

	if (Array.isArray(opts.is)) {
		options.is = opts.is.filter((x) => typeof x === 'string');
	}

	if (options.is.length === 0) {
		options.is = [DEFAULT_CONDITION];
	}

	if (typeof opts.unitsAndValues === 'object' && typeof opts.unitsAndValues.rootFontSize === 'number' && isPositiveAndNotZero(opts.unitsAndValues.rootFontSize)) {
		options.unitsAndValues.rootFontSize = opts.unitsAndValues.rootFontSize;
	}

	if (typeof opts.functionName === 'string') {
		options.functionName = opts.functionName;
	}

	return options;
}

function isPositiveAndNotZero(x: number) {
	return x > 0 && x !== Infinity;
}
