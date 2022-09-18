import { FULL_STOP, HYPHEN_MINUS, PLUS_SIGN } from '../codepoints/codepoints';
import { isDigitCodePoint } from '../codepoints/ranges';
import { CodePointReader } from '../interfaces/code-point-reader';

export enum NumberType {
	Integer = 1,
	Number = 2,
}

// https://www.w3.org/TR/2021/CRD-css-syntax-3-20211224/#consume-number
export function consumeNumber(reader: CodePointReader): [number, NumberType] {
	// 1. Initially set type to "integer".
	//    Let repr be the empty string.
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
		if (peeked !== false && peeked[0] === FULL_STOP && isDigitCodePoint(peeked[1])) {
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
		if (peeked !== false && peeked[0] === FULL_STOP && isDigitCodePoint(peeked[1])) {
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

	return [0, NumberType.Integer];
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


function parseNumber(value: string, isNumber: boolean): number|false {
	if (isNumber) {
		const floatValue = Number.parseFloat(value);
		if (Number.isNaN(floatValue)) {
			return false;
		}

		return floatValue;
	}

	const integerValue = Number.parseInt(value, 10);
	if (Number.isNaN(integerValue)) {
		return false;
	}

	return integerValue;
}
