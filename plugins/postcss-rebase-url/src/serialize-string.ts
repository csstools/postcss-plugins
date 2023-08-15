// https://www.w3.org/TR/cssom-1/#common-serializing-idioms
export function serializeString(str: string): string {
	let out = '';

	for (const codePoint of str) {
		const codePointNumber = codePoint.codePointAt(0);
		if (typeof codePointNumber === 'undefined') {
			out += String.fromCodePoint(0xFFFD);
			continue;
		}

		switch (codePointNumber) {
			case 0x0000:
				out += String.fromCodePoint(0xFFFD);
				break;
			case 0x007F:
				out += `\\${codePointNumber.toString(16)}`;
				break;
			case 0x0022:
			case 0x0027:
			case 0x005C:
				out += `\\${codePoint}`;
				break;
			default:
				if (0x0001 <= codePointNumber && codePointNumber <= 0x001f) {
					out += `\\${codePointNumber.toString(16)} `;
					break;
				}

				out += codePoint;
		}
	}

	return out;
}
