import decodeCSS from './decode.mjs';

/** Extract encoded selectors out of attribute selectors */
export default function extractEncodedSelectors(value) {
	var out = [];

	var depth = 0;
	var candidate;

	var quoted = false;
	var quotedMark;

	var containsUnescapedUnquotedHasAtDepth1 = false;

	// Stryker disable next-line EqualityOperator
	for (var i = 0; i < value.length; i++) {
		var char = value[i];

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
						if (containsUnescapedUnquotedHasAtDepth1) {
							out.push(decodeCSS(candidate));
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

	var unique = [];
	for (var j = 0; j < out.length; j++) {
		if (unique.indexOf(out[j]) === -1) {
			unique.push(out[j]);
		}
	}

	return unique;
}
