export function trim_lt_gt(str) {
	if (str.at(0) === '<' && str.at(-1) === '>') {
		return str.slice(1, -1);
	}

	return str;
}
