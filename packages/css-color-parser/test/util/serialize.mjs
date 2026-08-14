import { serializeRGB, serializeP3, serializeOKLCH, serializeHSL } from '@csstools/css-color-parser';
import { isTokenDimension, isTokenNumeric, isTokenPercentage, mutateUnit, stringify, tokenize } from '@csstools/css-tokenizer';

export function serialize_sRGB_data(x, gamutMapping = true) {
	if (!x) {
		return '';
	}

	return serializeRGB(x, gamutMapping).toString();
}

export function serialize_HSL_data(x) {
	if (!x) {
		return '';
	}

	return serializeHSL(x).toString();
}

export function serialize_P3_data(x, gamutMapping = true) {
	if (!x) {
		return '';
	}

	return serializeP3(x, gamutMapping).toString();
}

export function serialize_OKLCH_data(x) {
	if (!x) {
		return '';
	}

	return serializeOKLCH(x).toString();
}

export function nanToNone(component, unit = '') {
	if (Number.isNaN(component)) {
		return 'none';
	}

	if (unit) {
		return component.toString() + unit;
	}

	return component;
}

export function reducePrecisionWholeValue(color) {
	const tokens = tokenize({ css: color.trim() });

	for (let i = 0; i < tokens.length; i++) {
		const token = tokens[i];
		if (isTokenNumeric(token)) {
			let factor = Math.pow(10, 8);

			const y = Math.round(token[4].value * factor) / factor;

			if (isTokenDimension(token)) {
				token[4].value = y;
				mutateUnit(token, token[4].unit);
			} else if (isTokenPercentage(token)) {
				token[1] = y.toString() + '%';
			} else {
				token[1] = y.toString();
			}
		}
	}

	return stringify(...tokens);
}

export function reducePrecision(x, factor = 8) {
	if (Number.isNaN(x) || !Number.isFinite(x)) {
		return x;
	}

	factor = Math.pow(10, factor);

	return Math.round(x * factor) / factor;
}
