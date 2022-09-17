import { isDigitCodePoint } from '../codepoints/ranges';
import { CodePointReader } from '../interfaces/code-point-reader';

export enum NumberType {
	Integer = 1,
	Number = 2,
}

// https://www.w3.org/TR/2021/CRD-css-syntax-3-20211224/#consume-number
export function consumeNumber(reader: CodePointReader, initial: number): [number, NumberType] {
	reader.representation();

	return [0, NumberType.Integer];
}

function consumeDigits(reader: CodePointReader): string | false {
	let value = '';

	// eslint-disable-next-line no-constant-condition
	while (true) {
		const peeked = reader.peekOneCodePoint();
		if (peeked === false) {
			return false;
		}

		if (isDigitCodePoint(peeked)) {
			value += String.fromCharCode(peeked);
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
