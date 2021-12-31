import decodeCSS from './decode.mjs';

/** Extract encoded selectors out of attribute selectors */
export default function extractEncodedSelectors(value) {
	let out = [];

	let depth = 0;
	let candidate;

	// Stryker disable next-line EqualityOperator
	for (let i = 0; i < value.length; i++) {
		const char = value[i];

		switch (char) {
			case '[':
				if (depth === 0) {
					candidate = '';
				} else {
					candidate += char;
				}
				depth++;
				continue;
			case ']':
				{
					depth--;
					if (depth === 0) {
						const decoded = decodeCSS(candidate);
						if (decoded !== candidate && decoded.indexOf(':has(') > -1) {
							out.push(decoded);
						}
					} else {
						candidate += char;
					}
				}
				continue;
			case '\\':
				candidate += value[i];
				candidate += value[i+1];
				i++;
				continue;
			default:
				candidate += char;
				continue;
		}
	}

	const unique = [];
	for (let i = 0; i < out.length; i++) {
		if (unique.indexOf(out[i]) === -1) {
			unique.push(out[i]);
		}
	}

	return unique;
}
