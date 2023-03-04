import { serializeRGB } from '@csstools/css-color-parser';

export function serialize_sRGB_data(x) {
	if (!x) {
		return '';
	}

	return serializeRGB(x).toString();
}
