import decodeCSS from './decode.mjs';

/** Extract encoded selectors out of attribute selectors */
export default function extractEncodedSelectors(value) {
	let out = [];

	let depth = 0;
	let candidate;

	let quoted = false;
	let quotedMark = false;

	// Stryker disable next-line EqualityOperator
	for (let i = 0; i < value.length; i++) {
		const char = value[i];

		switch (char) {
			case '[':
				if (quoted) {
					continue;
				}

				if (depth === 0) {
					candidate = '';
				} else {
					candidate += char;
				}
				depth++;
				continue;
			case ']':
				if (quoted) {
					continue;
				}

				{
					depth--;
					if (depth === 0) {
						const decoded = decodeCSS(candidate);
						if (decoded.indexOf(':has(') > -1) {
							out.push(decoded);
						}
					} else {
						candidate += char;
					}
				}
				continue;
			case '\\':
				if (quoted) {
					i++;
					continue;
				}

				candidate += value[i];
				candidate += value[i+1];
				i++;
				continue;

			case '"':
			case '\'':
				if (quoted && char === quotedMark) {
					quoted = false;
					continue;
				}

				quoted = true;
				quotedMark = char;
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
