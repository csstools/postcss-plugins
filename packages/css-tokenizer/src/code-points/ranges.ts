import { BACKSPACE, DELETE, INFORMATION_SEPARATOR_ONE, LINE_TABULATION, LOW_LINE, HYPHEN_MINUS, NULL, SHIFT_OUT, LINE_FEED, CARRIAGE_RETURN, FORM_FEED, CHARACTER_TABULATION, SPACE } from './code-points';
// https://www.w3.org/TR/2021/CRD-css-syntax-3-20211224/#tokenizer-definitions

const digitsLow = '\u{30}'.charCodeAt(0);
const digitsHigh = '\u{39}'.charCodeAt(0);

// https://www.w3.org/TR/2021/CRD-css-syntax-3-20211224/#digit
export function isDigitCodePoint(search: number): boolean {
	return digitsLow <= search && search <= digitsHigh;
}

const letterUppercaseLow = '\u{41}'.charCodeAt(0);
const letterUppercaseHigh = '\u{5a}'.charCodeAt(0);

// https://www.w3.org/TR/2021/CRD-css-syntax-3-20211224/#uppercase-letter
export function isUppercaseLetterCodePoint(search: number): boolean {
	return letterUppercaseLow <= search && search <= letterUppercaseHigh;
}

const letterLowercaseLow = '\u{61}'.charCodeAt(0);
const letterLowercaseHigh = '\u{7a}'.charCodeAt(0);

// https://www.w3.org/TR/2021/CRD-css-syntax-3-20211224/#lowercase-letter
export function isLowercaseLetterCodePoint(search: number): boolean {
	return letterLowercaseLow <= search && search <= letterLowercaseHigh;
}

const afUppercaseHigh = '\u{46}'.charCodeAt(0);
const afLowercaseHigh = '\u{66}'.charCodeAt(0);

// https://www.w3.org/TR/2021/CRD-css-syntax-3-20211224/#hex-digit
export function isHexDigitCodePoint(search: number): boolean {
	if (digitsLow <= search && search <= digitsHigh) {
		return true;
	}

	if (letterLowercaseLow <= search && search <= afLowercaseHigh) {
		return true;
	}

	if (letterUppercaseLow <= search && search <= afUppercaseHigh) {
		return true;
	}

	return false;
}

// https://www.w3.org/TR/2021/CRD-css-syntax-3-20211224/#letter
export function isLetterCodePoint(search: number): boolean {
	return isLowercaseLetterCodePoint(search) || isUppercaseLetterCodePoint(search);
}

const nonASCIILow = '\u{80}'.charCodeAt(0);

// https://www.w3.org/TR/2021/CRD-css-syntax-3-20211224/#non-ascii-code-point
export function isNonASCIICodePoint(search: number): boolean {
	return search >= nonASCIILow;
}

// https://www.w3.org/TR/2021/CRD-css-syntax-3-20211224/#ident-start-code-point
export function isIdentStartCodePoint(search: number): boolean {
	if (isLetterCodePoint(search)) {
		return true;
	}

	if (isNonASCIICodePoint(search)) {
		return true;
	}

	return search === LOW_LINE;
}

// https://www.w3.org/TR/2021/CRD-css-syntax-3-20211224/#ident-code-point
export function isIdentCodePoint(search: number): boolean {
	if (isIdentStartCodePoint(search)) {
		return true;
	}

	if (isDigitCodePoint(search)) {
		return true;
	}

	return search === HYPHEN_MINUS;
}

// https://www.w3.org/TR/2021/CRD-css-syntax-3-20211224/#non-printable-code-point
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

	return SHIFT_OUT <= search && search <= INFORMATION_SEPARATOR_ONE;
}

// https://www.w3.org/TR/2021/CRD-css-syntax-3-20211224/#whitespace
export function isNewLine(search: number): boolean {
	switch (search) {
		case LINE_FEED:
		case CARRIAGE_RETURN:
		case FORM_FEED:
			// https://www.w3.org/TR/2021/CRD-css-syntax-3-20211224/#input-preprocessing
			// We can not follow the preprocessing rules because our output is text and must be minimally different from the input.
			// Applying the preprocessing rules would make it impossible to match the input.
			// A side effect of this is that our definition of whitespace is broader.
			return true;
		default:
			return false;
	}
}

// https://www.w3.org/TR/2021/CRD-css-syntax-3-20211224/#whitespace
export function isWhitespace(search: number): boolean {
	// https://www.w3.org/TR/2021/CRD-css-syntax-3-20211224/#input-preprocessing
	// We can not follow the preprocessing rules because our output is text and must be minimally different from the input.
	// Applying the preprocessing rules would make it impossible to match the input.
	// A side effect of this is that our definition of whitespace is broader.

	switch (search) {
		case LINE_FEED:
		case CARRIAGE_RETURN:
		case FORM_FEED:
		case CHARACTER_TABULATION:
		case SPACE:
			return true;

		default:
			return false;
	}
}

const surrogateLow = '\u{d800}'.charCodeAt(0);
const surrogateHigh = '\u{dfff}'.charCodeAt(0);

// https://infra.spec.whatwg.org/#surrogate
export function isSurrogate(search: number): boolean {
	return surrogateLow <= search && search <= surrogateHigh;
}
