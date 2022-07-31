import {
	DEFAULT_CONDITION,
	DEFAULT_VALUE_FUNCTION_NAME,
	DEFAULT_IMPORT_AT_RULE_NAME,
} from './constants';

export type pluginOptions = {
	importAtRuleName: string,
	is?: Array<string>
	unitsAndValues?: {
		rootFontSize?: number
	},
	valueFunctionName: string,
}

export type parsedPluginOptions = {
	importAtRuleName: string,
	is: Array<string>,
	unitsAndValues: {
		rootFontSize: number
	},
	valueFunctionName: string,
}

export function parsePluginOptions(opts?: pluginOptions): parsedPluginOptions {
	const options: parsedPluginOptions = {
		importAtRuleName: DEFAULT_IMPORT_AT_RULE_NAME,
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

	if (typeof opts.importAtRuleName === 'string') {
		options.importAtRuleName = opts.importAtRuleName;
	}

	return options;
}

function isPositiveAndNotZero(x: number) {
	return x > 0 && x !== Infinity;
}
