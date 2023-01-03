import { BACKSPACE, DELETE, INFORMATION_SEPARATOR_ONE, LINE_TABULATION, LOW_LINE, HYPHEN_MINUS, NULL, SHIFT_OUT } from './code-points';
// https://www.w3.org/TR/2021/CRD-css-syntax-3-20211224/#tokenizer-definitions

// https://www.w3.org/TR/2021/CRD-css-syntax-3-20211224/#digit
export function isDigitCodePoint(search: number): boolean {
	return search >= 0x0030 && search <= 0x0039;
}

// https://www.w3.org/TR/2021/CRD-css-syntax-3-20211224/#uppercase-letter
export function isUppercaseLetterCodePoint(search: number): boolean {
	return search >= 0x0041 && search <= 0x005a;
}

// https://www.w3.org/TR/2021/CRD-css-syntax-3-20211224/#lowercase-letter
export function isLowercaseLetterCodePoint(search: number): boolean {
	return search >= 0x0061 && search <= 0x007a;
}

// https://www.w3.org/TR/2021/CRD-css-syntax-3-20211224/#hex-digit
export function isHexDigitCodePoint(search: number): boolean {
	return (
		isDigitCodePoint(search) || // 0 .. 9
		(search >= 0x0061 && search <= 0x0066) || // a .. f
		(search >= 0x0041 && search <= 0x0046)    // A .. F
	);
}

// https://www.w3.org/TR/2021/CRD-css-syntax-3-20211224/#letter
export function isLetterCodePoint(search: number): boolean {
	return isLowercaseLetterCodePoint(search) || isUppercaseLetterCodePoint(search);
}

// https://www.w3.org/TR/2021/CRD-css-syntax-3-20211224/#non-ascii-code-point
export function isNonASCIICodePoint(search: number): boolean {
	return search >= 0x0080;
}

// https://www.w3.org/TR/2021/CRD-css-syntax-3-20211224/#ident-start-code-point
export function isIdentStartCodePoint(search: number): boolean {
	return isLetterCodePoint(search) || isNonASCIICodePoint(search) || search === LOW_LINE;
}

// https://www.w3.org/TR/2021/CRD-css-syntax-3-20211224/#ident-code-point
export function isIdentCodePoint(search: number): boolean {
	return isIdentStartCodePoint(search) || isDigitCodePoint(search) || search === HYPHEN_MINUS;
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
	return search === 0x000a || search === 0x000d || search === 0x000c;
}

// https://www.w3.org/TR/2021/CRD-css-syntax-3-20211224/#whitespace
export function isWhitespace(search: number): boolean {
	return search === 0x0020 || search === 0x000a || search === 0x0009 || search === 0x000d || search === 0x000c;
}

// https://infra.spec.whatwg.org/#surrogate
export function isSurrogate(search: number): boolean {
	return search >= 0xd800 && search <= 0xdfff;
}
