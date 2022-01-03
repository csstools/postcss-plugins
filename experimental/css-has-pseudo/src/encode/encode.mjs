
/** Returns the string as an encoded CSS identifier. */
export default function encodeCSS(value) {
	let out = '';
	let current = '';

	const flushCurrent = () => {
		const encoded = encodeURIComponent(current);
		let encodedCurrent = '';
		let encodedOut = '';

		const flushEncoded = () => {
			encodedOut += encodedCurrent;
			encodedCurrent = '';
		};

		for (let i = 0; i < encoded.length; i++) {
			const char = encoded[i];

			switch (char) {
				case '%':
					flushEncoded();
					encodedOut += ( '\\' + char );
					continue;

				default:
					encodedCurrent += char;
					continue;
			}
		}

		flushEncoded();
		out += encodedOut;
		current = '';
	};

	for (let i = 0; i < value.length; i++) {
		const char = value[i];

		switch (char) {
			case ':':
			case '[':
			case ']':
			case ',':
			case '(':
			case ')':
			case '.':
			case '*':
			case '~':
				flushCurrent();
				out += ( '\\' + char );
				continue;
			default:
				current += char;
				continue;
		}
	}

	flushCurrent();

	return out;
}
