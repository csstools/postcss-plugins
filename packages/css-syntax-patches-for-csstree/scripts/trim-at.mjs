export function trim_at(str) {
	if (str.at(0) === '@') {
		return str.slice(1);
	}

	return str;
}
