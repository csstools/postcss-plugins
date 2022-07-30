import {
	DEFAULT_CONDITION,
	DEFAULT_VALUE_FUNCTION_NAME,
} from './constants';

export type pluginOptions = {
	is?: Array<string>
	unitsAndValues?: {
		rootFontSize?: number
	},
	valueFunctionName: string,
}

export type parsedPluginOptions = {
	is: Array<string>,
	unitsAndValues: {
		rootFontSize: number
	},
	valueFunctionName: string,
}

export function parsePluginOptions(opts?: pluginOptions): parsedPluginOptions {
	const options: parsedPluginOptions = {
		is: [DEFAULT_CONDITION],
		unitsAndValues: {
			rootFontSize: 16,
		},
		valueFunctionName: DEFAULT_VALUE_FUNCTION_NAME,
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

	if (typeof opts.valueFunctionName === 'string') {
		options.valueFunctionName = opts.valueFunctionName;
	}
	}

	return options;
}

function isPositiveAndNotZero(x: number) {
	return x > 0 && x !== Infinity;
}
