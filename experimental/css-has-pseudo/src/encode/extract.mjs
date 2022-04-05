import decodeCSS from './decode.mjs';

/** Extract encoded selectors out of attribute selectors */
export default function extractEncodedSelectors(value) {
	let out = [];

	let depth = 0;
	let candidate;

	let quoted = false;
	let quotedMark;

	let containsUnescapedUnquotedHasAtDepth1 = false;

	// Stryker disable next-line EqualityOperator
	for (let i = 0; i < value.length; i++) {
		const char = value[i];

		switch (char) {
			case '[':
				if (quoted) {
					candidate += char;
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
					candidate += char;
					continue;
				}

				{
					depth--;
					if (depth === 0) {
						const decoded = decodeCSS(candidate);
						if (containsUnescapedUnquotedHasAtDepth1) {
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

			case '"':
			case '\'':
				if (quoted && char === quotedMark) {
					quoted = false;
					continue;
				} else if (quoted) {
					candidate += char;
					continue;
				}

				quoted = true;
				quotedMark = char;
				continue;

			default:
				if (candidate === '' && depth === 1 && (value.slice(i, i + 13) === 'csstools-has-')) {
					containsUnescapedUnquotedHasAtDepth1 = true;
				}

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
