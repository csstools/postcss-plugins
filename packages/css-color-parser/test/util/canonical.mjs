import { color } from '@csstools/css-color-parser';
import { parse } from '../util/parse.mjs';
import { serialize_sRGB_data } from '../util/serialize.mjs';

export function canonicalize(x) {
	const result = serialize_sRGB_data(color(parse(x)));
	if (!result) {
		return '<invalid>';
	}

	return result;
}
