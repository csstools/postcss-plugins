import { FULL_STOP, HYPHEN_MINUS, LATIN_CAPITAL_LETTER_E, LATIN_SMALL_LETTER_E, PLUS_SIGN } from '../code-points/code-points';
import { codePointsToString } from '../code-points/code-points-to-string';
import { isDigitCodePoint } from '../code-points/ranges';
import { CodePointReader } from '../interfaces/code-point-reader';
import { Context } from '../interfaces/context';
import { NumberType } from '../interfaces/token';

// https://www.w3.org/TR/2021/CRD-css-syntax-3-20211224/#consume-number
export function consumeNumber(ctx: Context, reader: CodePointReader): [number, NumberType] {
	// 1. Initially set type to "integer".
	// Let repr be the empty string.
	let type = NumberType.Integer;
	const repr: Array<number> = [];

	{
		// 2. If the next input code point is U+002B PLUS SIGN (+) or U+002D HYPHEN-MINUS (-), consume it and append it to repr.
		const peeked = reader.peekOneCodePoint();
		if (peeked === PLUS_SIGN || peeked === HYPHEN_MINUS) {
			reader.readCodePoint();
			repr.push(peeked);
		}

		// 3. While the next input code point is a digit, consume it and append it to repr.
		repr.push(...consumeDigits(reader));
	}

	{
		// 4. If the next 2 input code points are U+002E FULL STOP (.) followed by a digit, then:
		const peeked = reader.peekTwoCodePoints();
		if (peeked[0] === FULL_STOP && isDigitCodePoint(peeked[1])) {
			// 4.1. Consume them.
			reader.readCodePoint();
			reader.readCodePoint();

			// 4.2. Append them to repr.
			repr.push(...peeked);

			// 4.3. Set type to "number".
			type = NumberType.Number;

			// 4.4. While the next input code point is a digit, consume it and append it to repr.
			repr.push(...consumeDigits(reader));
		}
	}

	{
		// 5. If the next 2 or 3 input code points are U+0045 LATIN CAPITAL LETTER E (E) or U+0065 LATIN SMALL LETTER E (e),
		// optionally followed by U+002D HYPHEN-MINUS (-) or U+002B PLUS SIGN (+),
		// followed by a digit, then:
		const peeked = reader.peekThreeCodePoints();
		if (
			(peeked[0] === LATIN_SMALL_LETTER_E || peeked[0] === LATIN_CAPITAL_LETTER_E) &&
			isDigitCodePoint(peeked[1])
		) {
			// 5.1. Consume them.
			reader.readCodePoint();
			reader.readCodePoint();

			// 5.2. Append them to repr.
			repr.push(...peeked);

			// 5.3. Set type to "number".
			type = NumberType.Number;

			// 5.4. While the next input code point is a digit, consume it and append it to repr.
			repr.push(...consumeDigits(reader));
		}

		if (
			(peeked[0] === LATIN_SMALL_LETTER_E || peeked[0] === LATIN_CAPITAL_LETTER_E) &&
			(
				(peeked[1] === HYPHEN_MINUS || peeked[1] === PLUS_SIGN) &&
				isDigitCodePoint(peeked[2])
			)
		) {
			// 5.1. Consume them.
			reader.readCodePoint();
			reader.readCodePoint();
			reader.readCodePoint();

			// 5.2. Append them to repr.
			repr.push(...peeked);

			// 5.3. Set type to "number".
			type = NumberType.Number;

			// 5.4. While the next input code point is a digit, consume it and append it to repr.
			repr.push(...consumeDigits(reader));
		}
	}

	// 6. Convert repr to a number, and set the value to the returned value.
	const value = convertCodePointsToNumber(repr);

	// 7. Return value and type.
	return [value, type];
}

function consumeDigits(reader: CodePointReader): Array<number> {
	const value: Array<number> = [];

	// eslint-disable-next-line no-constant-condition
	while (true) {
		const peeked = reader.peekOneCodePoint();
		if (peeked === false) {
			return value;
		}

		if (isDigitCodePoint(peeked)) {
			value.push(peeked);
			reader.readCodePoint();
		} else {
			return value;
		}
	}
}

// https://www.w3.org/TR/2021/CRD-css-syntax-3-20211224/#convert-string-to-number
function convertCodePointsToNumber(codePoints: Array<number>): number {
	let s = 1;
	const iCodePoints: Array<number> = [];
	let i = 0;

	let d = 0;
	const fCodePoints: Array<number> = [];
	let f = 0;

	let t = 1;

	const eCodePoints: Array<number> = [];
	let e = 0;

	let cursor = 0;

	// 1. A sign: a single U+002B PLUS SIGN (+) or U+002D HYPHEN-MINUS (-), or the empty string.
	// Let s be the number -1 if the sign is U+002D HYPHEN-MINUS (-);
	// otherwise, let s be the number 1.
	if (codePoints[cursor] === HYPHEN_MINUS) {
		cursor++;
		s = -1;
	} else if (codePoints[cursor] === PLUS_SIGN) {
		cursor++;
	}

	// 2. An integer part: zero or more digits.
	// If there is at least one digit,
	// let i be the number formed by interpreting the digits as a base-10 integer;
	// otherwise, let i be the number 0.
	while (cursor < codePoints.length && isDigitCodePoint(codePoints[cursor])) {
		iCodePoints.push(codePoints[cursor]);
		cursor++;
	}

	i = digitCodePointsToInteger(iCodePoints);

	// 3. A decimal point: a single U+002E FULL STOP (.), or the empty string.
	if (codePoints[cursor] === FULL_STOP) {
		cursor++;
	}

	// 4. A fractional part: zero or more digits.
	// If there is at least one digit,
	// let f be the number formed by interpreting the digits as a base-10 integer and d be the number of digits;
	// otherwise, let f and d be the number 0.
	while (cursor < codePoints.length && isDigitCodePoint(codePoints[cursor])) {
		fCodePoints.push(codePoints[cursor]);
		cursor++;
	}

	d = fCodePoints.length;
	f = (digitCodePointsToInteger(fCodePoints) / Math.pow(10, d));

	// 5. An exponent indicator: a single U+0045 LATIN CAPITAL LETTER E (E) or U+0065 LATIN SMALL LETTER E (e), or the empty string.
	if (codePoints[cursor] === LATIN_SMALL_LETTER_E || codePoints[cursor] === LATIN_CAPITAL_LETTER_E) {
		cursor++;
	}

	// 6. An exponent sign: a single U+002B PLUS SIGN (+) or U+002D HYPHEN-MINUS (-), or the empty string.
	// Let t be the number -1 if the sign is U+002D HYPHEN-MINUS (-);
	// otherwise, let t be the number 1.
	if (codePoints[cursor] === HYPHEN_MINUS) {
		cursor++;
		t = -1;
	} else if (codePoints[cursor] === PLUS_SIGN) {
		cursor++;
	}

	// 7. An exponent: zero or more digits.
	// If there is at least one digit,
	// let e be the number formed by interpreting the digits as a base-10 integer;
	// otherwise, let e be the number 0.
	while (cursor < codePoints.length && isDigitCodePoint(codePoints[cursor])) {
		eCodePoints.push(codePoints[cursor]);
		cursor++;
	}

	e = digitCodePointsToInteger(eCodePoints);

	// Return the number s·(i + f·10-d)·10te.
	return s * (i + f) * Math.pow(10, t * e);
}

function digitCodePointsToInteger(codePoints: Array<number>): number {
	if (codePoints.length === 0) {
		return 0;
	}

	const stringValue = codePointsToString(codePoints);

	const integerValue = Number.parseInt(stringValue, 10);
	if (Number.isNaN(integerValue)) {
		throw new Error(`Unexpected "NaN" result when parsing a number from digit code points: "${stringValue}"`);
	}

	return integerValue;
}
