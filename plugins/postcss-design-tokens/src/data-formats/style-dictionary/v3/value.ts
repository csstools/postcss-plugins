import { TokenTransformOptions } from '../../base/token';
import valueParser from 'postcss-value-parser';

export type StyleDictionaryV3TokenValue = {
	cssValue(transformOptions?: TokenTransformOptions): string
	// The value of the design token. This can be any type of data, a hex string, an integer, a file path to a file, even an object or array.
	value: unknown
	// Usually the name for a design token is generated with a name transform, but you can write your own if you choose. By default Style Dictionary will add a default name which is the key of the design token object.
	name?: string
	// The comment attribute will show up in a code comment in output files if the format supports it.
	comment?: string
	// This is used in formats that support override-able or themeable values like the !default flag in Sass.
	themeable?: boolean
	// Extra information about the design token you want to include. Attribute transforms will modify this object so be careful
	attributes?: unknown

	// Set by the token parser
	metadata?: {
		// A default name of the design token that is set to the key of the design token. This is only added if you do not provide one.
		name?: string
		// The object path of the design token.
		path: Array<string>
		// The file path of the file the token is defined in. This file path is derived from the source or include file path arrays defined in the configuration.
		filePath: string
		// If the token is from a file defined in the source array as opposed to include in the configuration.
		isSource: boolean
	}
}

export function extractStyleDictionaryV3Token(node: Record<string, unknown>, key: string, path: Array<string>, filePath: string): StyleDictionaryV3TokenValue {
	if (typeof node['value'] === 'undefined') {
		throw new Error('Token value is undefined for "' + [...path, key].join('.') + '"');
	}

	switch (typeof node['value']) {
		case 'string':
		case 'number':
			break;

		default:
			throw new Error('Token value is not a string or a number for "' + [...path, key].join('.') + '"');
	}

	const value = String(node['value']);

	return {
		value: value,
		cssValue: (transformOptions?: TokenTransformOptions) => {
			return applyTransformsToValue(value, transformOptions);
		},
		name: String(node['name'] ?? '') || key,
		comment: String(node['comment'] ?? '') || undefined,
		metadata: {
			name: String(node['name'] ?? '') ? key : undefined,
			path: [...path, key],
			filePath: filePath,
			isSource: true,
		},
	};
}

const unitValidity : Map<string, boolean> = new Map();

export function applyTransformsToValue(value: string|undefined|null, transformOptions?: TokenTransformOptions): string {
	if (!value) {
		return '';
	}

	if (!transformOptions) {
		return value;
	}

	if (!transformOptions.toUnit) {
		return value;
	}

	const dimension = valueParser.unit(value ?? '');
	if (!dimension || dimension.unit === transformOptions.toUnit) {
		return value;
	}

	if (!dimension.unit) {
		if (unitValidity.has(transformOptions.toUnit)) {
			if (unitValidity.get(transformOptions.toUnit)) {
				return `${value}${transformOptions.toUnit}`;
			} else {
				throw new Error(`Invalid unit "${transformOptions.toUnit}" for "${value}"`);
			}
		}

		try {
			// - concatenate the value and the desired unit.
			// - try to parse the result as a CSS dimension (value + unit)
			// - if the unit is not equal to the original we know that the input was incorrect.
			const resultingDimension = valueParser.unit(`${value}${transformOptions.toUnit}`);
			if (resultingDimension && resultingDimension.unit === transformOptions.toUnit) {
				unitValidity.set(transformOptions.toUnit, true);
				return `${value}${transformOptions.toUnit}`;
			}

			unitValidity.set(transformOptions.toUnit, false);
		} catch (_) {
			unitValidity.set(transformOptions.toUnit, false);
		}

		throw new Error(`Invalid unit "${transformOptions.toUnit}" for "${value}"`);
	}

	if (dimension.unit === 'rem' && transformOptions.toUnit === 'px') {
		return remToPx(parseFloat(dimension.number), transformOptions.pluginOptions?.rootFontSize ?? 16);
	}

	if (dimension.unit === 'px' && transformOptions.toUnit === 'rem') {
		return pxToRem(parseFloat(dimension.number), transformOptions.pluginOptions?.rootFontSize ?? 16);
	}

	return value;
}

function remToPx(value: number, rootFontSize: number): string {
	return `${formatFloat(value * rootFontSize)}px`;
}

function pxToRem(value: number, rootFontSize: number): string {
	return `${formatFloat(value / rootFontSize)}rem`;
}

function formatFloat(value: number): string {
	if (Number.isInteger(value)) {
		return value.toString();
	}

	let fixedPrecision = value.toFixed(5);
	for (let i = fixedPrecision.length; i > 0; i--) {
		if (fixedPrecision[i] === '.') {
			break;
		}

		if (fixedPrecision[i] !== '0') {
			fixedPrecision = fixedPrecision.slice(0, i + 1);
			continue;
		}
	}

	return fixedPrecision;
}
