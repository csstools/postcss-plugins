// "MIT" => ["MIT"]
// "(MIT OR LGPL-3.0+)" => ["MIT", "LGPL-3.0+"]
export function parseLicenseField(field) {
	const licenses = [];

	let buff = '';

	PARSE_LOOP:
	for (let index = 0; index < field.length; index++) {
		const char = field[index];

		if (buff.trim().toLowerCase() === 'or' || buff.trim().toLowerCase() === 'and') {
			buff = '';
		}

		switch (char) {
			case '(':
				buff = '';
				continue PARSE_LOOP;
			case ')':
				buff = '';
				continue PARSE_LOOP;
			case ' ':
				if (buff.trim()) {
					licenses.push(buff.trim());
				}

				buff = '';
				continue PARSE_LOOP;

			default:
				buff += char;
				break;
		}
	}

	if (buff.trim()) {
		licenses.push(buff.trim());
	}

	return licenses;
}
