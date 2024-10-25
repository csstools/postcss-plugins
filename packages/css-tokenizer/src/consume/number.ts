import { FULL_STOP, HYPHEN_MINUS, LATIN_CAPITAL_LETTER_E, LATIN_SMALL_LETTER_E, PLUS_SIGN } from '../code-points/code-points';
import { isDigitCodePoint } from '../code-points/ranges';
import type { CodePointReader } from '../interfaces/code-point-reader';
import type { Context } from '../interfaces/context';
import { NumberType } from '../interfaces/token';

// https://www.w3.org/TR/2021/CRD-css-syntax-3-20211224/#consume-number
export function consumeNumber(ctx: Context, reader: CodePointReader): NumberType {
	// 1. Initially set type to "integer".
	let type = NumberType.Integer;

	// 2. If the next input code point is U+002B PLUS SIGN (+) or U+002D HYPHEN-MINUS (-), consume it and append it to repr.
	if (reader.source.codePointAt(reader.cursor) === PLUS_SIGN || reader.source.codePointAt(reader.cursor) === HYPHEN_MINUS) {
		reader.advanceCodePoint();
	}

	// 3. While the next input code point is a digit, consume it and append it to repr.
	while (isDigitCodePoint(reader.source.codePointAt(reader.cursor) ?? -1)) {
		reader.advanceCodePoint();
	}

	// 4. If the next 2 input code points are U+002E FULL STOP (.) followed by a digit, then:
	if (reader.source.codePointAt(reader.cursor) === FULL_STOP && isDigitCodePoint(reader.source.codePointAt(reader.cursor + 1) ?? -1)) {
		// 4.1. Consume them.
		reader.advanceCodePoint(2);

		// 4.3. Set type to "number".
		type = NumberType.Number;

		// 4.4. While the next input code point is a digit, consume it and append it to repr.
		while (isDigitCodePoint(reader.source.codePointAt(reader.cursor) ?? -1)) {
			reader.advanceCodePoint();
		}
	}

	// 5. If the next 2 or 3 input code points are U+0045 LATIN CAPITAL LETTER E (E) or U+0065 LATIN SMALL LETTER E (e),
	// optionally followed by U+002D HYPHEN-MINUS (-) or U+002B PLUS SIGN (+),
	// followed by a digit, then:
	if (reader.source.codePointAt(reader.cursor) === LATIN_SMALL_LETTER_E || reader.source.codePointAt(reader.cursor) === LATIN_CAPITAL_LETTER_E) {
		if (isDigitCodePoint(reader.source.codePointAt(reader.cursor + 1) ?? -1)) {
			// 5.1. Consume them.
			reader.advanceCodePoint(2);
		} else if (
			(reader.source.codePointAt(reader.cursor + 1) === HYPHEN_MINUS || reader.source.codePointAt(reader.cursor + 1) === PLUS_SIGN) &&
			isDigitCodePoint(reader.source.codePointAt(reader.cursor + 2) ?? -1)
		) {
			// 5.1. Consume them.
			reader.advanceCodePoint(3);
		} else {
			return type;
		}

		// 5.3. Set type to "number".
		type = NumberType.Number;

		// 5.4. While the next input code point is a digit, consume it and append it to repr.
		while (isDigitCodePoint(reader.source.codePointAt(reader.cursor) ?? -1)) {
			reader.advanceCodePoint();
		}
	}

	return type;
}
