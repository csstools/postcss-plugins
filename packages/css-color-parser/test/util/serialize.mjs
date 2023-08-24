import { serializeRGB, serializeP3, serializeOKLCH } from '@csstools/css-color-parser';

export function serialize_sRGB_data(x) {
	if (!x) {
		return '';
	}

	return serializeRGB(x).toString();
}

export function serialize_P3_data(x) {
	if (!x) {
		return '';
	}

	return serializeP3(x).toString();
}

export function serialize_OKLCH_data(x) {
	if (!x) {
		return '';
	}

	return serializeOKLCH(x).toString();
}
