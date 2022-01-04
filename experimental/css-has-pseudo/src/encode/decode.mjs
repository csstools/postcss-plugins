
/** Decodes an identifier back into a CSS selector */
export default function decodeCSS(value) {
	let out = '';

	for (let i = 0; i < value.length; i++) {
		const char = value[i];

		switch (char) {
			case '\\':
				i++;
				out += value[i];
				continue;
			default:
				out += char;
				continue;
		}
	}

	return decodeURIComponent(out);
}
