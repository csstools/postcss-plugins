import { BACKSPACE, DELETE, INFORMATION_SEPARATOR_ONE, LINE_TABULATION, LOW_LINE, HYPHEN_MINUS, NULL, SHIFT_OUT, LINE_FEED, CARRIAGE_RETURN, FORM_FEED, SPACE, CHARACTER_TABULATION } from './code-points';
// https://www.w3.org/TR/2021/CRD-css-syntax-3-20211224/#tokenizer-definitions

// https://www.w3.org/TR/2021/CRD-css-syntax-3-20211224/#digit
export function isDigitCodePoint(search: number): boolean {
	return search >= 0x0030 && search <= 0x0039;
}

// https://www.w3.org/TR/2021/CRD-css-syntax-3-20211224/#uppercase-letter
function isUppercaseLetterCodePoint(search: number): boolean {
	return search >= 0x0041 && search <= 0x005a;
}

// https://www.w3.org/TR/2021/CRD-css-syntax-3-20211224/#lowercase-letter
function isLowercaseLetterCodePoint(search: number): boolean {
	return search >= 0x0061 && search <= 0x007a;
}

// https://www.w3.org/TR/2021/CRD-css-syntax-3-20211224/#hex-digit
export function isHexDigitCodePoint(search: number): boolean {
	return (
		(search >= 0x0030 && search <= 0x0039) || // 0 .. 9
		(search >= 0x0061 && search <= 0x0066) || // a .. f
		(search >= 0x0041 && search <= 0x0046)    // A .. F
	);
}

// https://www.w3.org/TR/2021/CRD-css-syntax-3-20211224/#letter
function isLetterCodePoint(search: number): boolean {
	return isLowercaseLetterCodePoint(search) || isUppercaseLetterCodePoint(search);
}

// https://www.w3.org/TR/2021/CRD-css-syntax-3-20211224/#ident-start-code-point
export function isIdentStartCodePoint(search: number): boolean {
	return isLetterCodePoint(search) || isNonASCII_IdentCodePoint(search) || search === LOW_LINE;
}

// https://www.w3.org/TR/2021/CRD-css-syntax-3-20211224/#ident-code-point
export function isIdentCodePoint(search: number): boolean {
	return isIdentStartCodePoint(search) || isDigitCodePoint(search) || search === HYPHEN_MINUS;
}

// https://drafts.csswg.org/css-syntax/#non-ascii-ident-code-point
function isNonASCII_IdentCodePoint(search: number): boolean {
	if (
		search === 0x00B7 ||
		search === 0x200C ||
		search === 0x200D ||
		search === 0x203F ||
		search === 0x2040 ||
		search === 0x200C
	) {
		return true;
	}

	if (
		(0x00C0 <= search && search <= 0x00D6) ||
		(0x00D8 <= search && search <= 0x00F6) ||
		(0x00F8 <= search && search <= 0x037D) ||
		(0x037F <= search && search <= 0x1FFF) ||
		(0x2070 <= search && search <= 0x218F) ||
		(0x2C00 <= search && search <= 0x2FEF) ||
		(0x3001 <= search && search <= 0xD7FF) ||
		(0xF900 <= search && search <= 0xFDCF) ||
		(0xFDF0 <= search && search <= 0xFFFD)
	) {
		return true;
	}

	// Input preprocessing
	if (search === 0x000) {
		return true;
	} else if (isSurrogate(search)) {
		return true;
	}

	return search >= 0x10000;
}

// https://www.w3.org/TR/2021/CRD-css-syntax-3-20211224/#non-printable-code-point
export function isNonPrintableCodePoint(search: number): boolean {
	return (
		(search === LINE_TABULATION) ||
		(search === DELETE) ||
		(NULL <= search && search <= BACKSPACE) ||
		(SHIFT_OUT <= search && search <= INFORMATION_SEPARATOR_ONE)
	);
}

// https://www.w3.org/TR/2021/CRD-css-syntax-3-20211224/#whitespace
export function isNewLine(search: number): boolean {
	return search === LINE_FEED || search === CARRIAGE_RETURN || search === FORM_FEED;
}

// https://www.w3.org/TR/2021/CRD-css-syntax-3-20211224/#whitespace
export function isWhitespace(search: number): boolean {
	return search === SPACE || search === LINE_FEED || search === CHARACTER_TABULATION || search === CARRIAGE_RETURN || search === FORM_FEED;
}

// https://infra.spec.whatwg.org/#surrogate
export function isSurrogate(search: number): boolean {
	return search >= 0xd800 && search <= 0xdfff;
}
