import { serializeRGB, serializeP3, serializeOKLCH, serializeHSL } from '@csstools/css-color-parser';

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
