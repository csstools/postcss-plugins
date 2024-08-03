import type { CSSToken } from "./token";

/**
 * The CSS Tokenizer is forgiving and will never throw on invalid input.
 * Any errors are reported through the `onParseError` callback.
 */
export class ParseError extends Error {
	/** The index of the start character of the current token. */
	sourceStart: number;
	/** The index of the end character of the current token. */
	sourceEnd: number;
	/** The parser steps that preceded the error. */
	parserState: Array<string>;

	constructor(message: string, sourceStart: number, sourceEnd: number, parserState: Array<string>) {
		super(message);
		this.name = 'ParseError';

		this.sourceStart = sourceStart;
		this.sourceEnd = sourceEnd;
		this.parserState = parserState;
	}
}

export class ParseErrorWithToken extends ParseError {
	/** The associated token. */
	token: CSSToken;

	constructor(message: string, sourceStart: number, sourceEnd: number, parserState: Array<string>, token: CSSToken) {
		super(message, sourceStart, sourceEnd, parserState);

		this.token = token;
	}
}

export const ParseErrorMessage = {
	UnexpectedNewLineInString: 'Unexpected newline while consuming a string token.',
	UnexpectedEOFInString: 'Unexpected EOF while consuming a string token.',
	UnexpectedEOFInComment: 'Unexpected EOF while consuming a comment.',
	UnexpectedEOFInURL: 'Unexpected EOF while consuming a url token.',
	UnexpectedEOFInEscapedCodePoint: 'Unexpected EOF while consuming an escaped code point.',
	UnexpectedCharacterInURL: 'Unexpected character while consuming a url token.',
	InvalidEscapeSequenceInURL: 'Invalid escape sequence while consuming a url token.',
	InvalidEscapeSequenceAfterBackslash: 'Invalid escape sequence after "\\"',
}
