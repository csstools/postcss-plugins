import { BACKSPACE, DELETE, INFORMATION_SEPARATOR_ONE, LINE_TABULATION, LOW_LINE, HYPHEN_MINUS, NULL, SHIFT_OUT } from './codepoints';

const digitsLow = '\u{30}'.charCodeAt(0);
const digitsHigh = '\u{39}'.charCodeAt(0);

export function isDigitCodePoint(search: number): boolean {
	if (digitsLow <= search && search <= digitsHigh) {
		return true;
	}

	return false;
}

const afUppercaseLow = '\u{41}'.charCodeAt(0);
const afUppercaseHigh = '\u{46}'.charCodeAt(0);
const afLowercaseLow = '\u{61}'.charCodeAt(0);
const afLowercaseHigh = '\u{66}'.charCodeAt(0);

export function isHexDigitCodePoint(search: number): boolean {
	if (isDigitCodePoint(search)) {
		return true;
	}

	if (afUppercaseLow <= search && search <= afUppercaseHigh) {
		return true;
	}

	if (afLowercaseLow <= search && search <= afLowercaseHigh) {
		return true;
	}

	return false;
}

const letterUppercaseLow = '\u{41}'.charCodeAt(0);
const letterUppercaseHigh = '\u{5a}'.charCodeAt(0);

export function isUppercaseLetterCodePoint(search: number): boolean {
	if (letterUppercaseLow <= search && search <= letterUppercaseHigh) {
		return true;
	}

	return false;
}

const letterLowercaseLow = '\u{61}'.charCodeAt(0);
const letterLowercaseHigh = '\u{7a}'.charCodeAt(0);

export function isLowercaseLetterCodePoint(search: number): boolean {
	if (letterLowercaseLow <= search && search <= letterLowercaseHigh) {
		return true;
	}

	return false;
}

export function isLetterCodePoint(search: number): boolean {
	if (isUppercaseLetterCodePoint(search) || isLowercaseLetterCodePoint(search)) {
		return true;
	}

	return false;
}

const nonASCIILow = '\u{80}'.charCodeAt(0);

export function isNonASCIICodePoint(search: number): boolean {
	return search >= nonASCIILow;
}

export function isIdentStartCodePoint(search: number): boolean {
	if (isLetterCodePoint(search)) {
		return true;
	}

	if (isNonASCIICodePoint(search)) {
		return true;
	}

	return search === LOW_LINE;
}

export function isIdentCodePoint(search: number): boolean {
	if (isIdentStartCodePoint(search)) {
		return true;
	}

	if (isDigitCodePoint(search)) {
		return true;
	}

	return search === HYPHEN_MINUS;
}

export function isNonPrintableCodePoint(search: number): boolean {
	if (search === LINE_TABULATION) {
		return true;
	}

	if (search === DELETE) {
		return true;
	}

	if (NULL <= search && search <= BACKSPACE) {
		return true;
	}

	if (SHIFT_OUT <= search && search <= INFORMATION_SEPARATOR_ONE) {
		return true;
	}

	return false;
}
