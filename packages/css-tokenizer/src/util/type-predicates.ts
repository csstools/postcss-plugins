import type { CSSToken, NumericToken, TokenAtKeyword, TokenBadString, TokenBadURL, TokenCDC, TokenCDO, TokenCloseCurly, TokenCloseParen, TokenCloseSquare, TokenColon, TokenComma, TokenComment, TokenDelim, TokenDimension, TokenEOF, TokenFunction, TokenHash, TokenIdent, TokenNumber, TokenOpenCurly, TokenOpenParen, TokenOpenSquare, TokenPercentage, TokenSemicolon, TokenString, TokenURL, TokenUnicodeRange, TokenWhitespace } from '../interfaces/token';
import { TokenType } from '../interfaces/token';

const tokenTypes = Object.values(TokenType);

/**
 * Assert that a given value has the general structure of a CSS token:
 * 1. is an array.
 * 2. has at least four items.
 * 3. has a known token type.
 * 4. has a string representation.
 * 5. has a start position.
 * 6. has an end position.
 */
export function isToken(x: any): x is CSSToken { // eslint-disable-line @typescript-eslint/no-explicit-any
	if (!Array.isArray(x)) {
		return false;
	}

	if (x.length < 4) {
		return false;
	}

	if (!tokenTypes.includes(x[0] as TokenType)) {
		return false;
	}

	if (typeof x[1] !== 'string') {
		return false;
	}

	if (typeof x[2] !== 'number') {
		return false;
	}

	if (typeof x[3] !== 'number') {
		return false;
	}

	return true;
}

/**
 * Assert that a token is a numeric token
 */
export function isTokenNumeric(x?: CSSToken | null): x is NumericToken {
	if (!x) return false;

	switch (x[0]) {
		case TokenType.Dimension:
		case TokenType.Number:
		case TokenType.Percentage:
			return true;
		default:
			return false;
	}
}

/**
 * Assert that a token is a whitespace or comment token
 */
export function isTokenWhiteSpaceOrComment(x?: CSSToken | null): x is TokenWhitespace | TokenComment {
	if (!x) return false;

	switch (x[0]) {
		case TokenType.Whitespace:
		case TokenType.Comment:
			return true;
		default:
			return false;
	}
}

export function isTokenAtKeyword(x?: CSSToken | null): x is TokenAtKeyword {
	return !!x && x[0] === TokenType.AtKeyword;
}
export function isTokenBadString(x?: CSSToken | null): x is TokenBadString {
	return !!x && x[0] === TokenType.BadString;
}
export function isTokenBadURL(x?: CSSToken | null): x is TokenBadURL {
	return !!x && x[0] === TokenType.BadURL;
}
export function isTokenCDC(x?: CSSToken | null): x is TokenCDC {
	return !!x && x[0] === TokenType.CDC;
}
export function isTokenCDO(x?: CSSToken | null): x is TokenCDO {
	return !!x && x[0] === TokenType.CDO;
}
export function isTokenColon(x?: CSSToken | null): x is TokenColon {
	return !!x && x[0] === TokenType.Colon;
}
export function isTokenComma(x?: CSSToken | null): x is TokenComma {
	return !!x && x[0] === TokenType.Comma;
}
export function isTokenComment(x?: CSSToken | null): x is TokenComment {
	return !!x && x[0] === TokenType.Comment;
}
export function isTokenDelim(x?: CSSToken | null): x is TokenDelim {
	return !!x && x[0] === TokenType.Delim;
}
export function isTokenDimension(x?: CSSToken | null): x is TokenDimension {
	return !!x && x[0] === TokenType.Dimension;
}
export function isTokenEOF(x?: CSSToken | null): x is TokenEOF {
	return !!x && x[0] === TokenType.EOF;
}
export function isTokenFunction(x?: CSSToken | null): x is TokenFunction {
	return !!x && x[0] === TokenType.Function;
}
export function isTokenHash(x?: CSSToken | null): x is TokenHash {
	return !!x && x[0] === TokenType.Hash;
}
export function isTokenIdent(x?: CSSToken | null): x is TokenIdent {
	return !!x && x[0] === TokenType.Ident;
}
export function isTokenNumber(x?: CSSToken | null): x is TokenNumber {
	return !!x && x[0] === TokenType.Number;
}
export function isTokenPercentage(x?: CSSToken | null): x is TokenPercentage {
	return !!x && x[0] === TokenType.Percentage;
}
export function isTokenSemicolon(x?: CSSToken | null): x is TokenSemicolon {
	return !!x && x[0] === TokenType.Semicolon;
}
export function isTokenString(x?: CSSToken | null): x is TokenString {
	return !!x && x[0] === TokenType.String;
}
export function isTokenURL(x?: CSSToken | null): x is TokenURL {
	return !!x && x[0] === TokenType.URL;
}
export function isTokenWhitespace(x?: CSSToken | null): x is TokenWhitespace {
	return !!x && x[0] === TokenType.Whitespace;
}
export function isTokenOpenParen(x?: CSSToken | null): x is TokenOpenParen {
	return !!x && x[0] === TokenType.OpenParen;
}
export function isTokenCloseParen(x?: CSSToken | null): x is TokenCloseParen {
	return !!x && x[0] === TokenType.CloseParen;
}
export function isTokenOpenSquare(x?: CSSToken | null): x is TokenOpenSquare {
	return !!x && x[0] === TokenType.OpenSquare;
}
export function isTokenCloseSquare(x?: CSSToken | null): x is TokenCloseSquare {
	return !!x && x[0] === TokenType.CloseSquare;
}
export function isTokenOpenCurly(x?: CSSToken | null): x is TokenOpenCurly {
	return !!x && x[0] === TokenType.OpenCurly;
}
export function isTokenCloseCurly(x?: CSSToken | null): x is TokenCloseCurly {
	return !!x && x[0] === TokenType.CloseCurly;
}
export function isTokenUnicodeRange(x?: CSSToken | null): x is TokenUnicodeRange {
	return !!x && x[0] === TokenType.UnicodeRange;
}
