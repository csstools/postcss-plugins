import { checkIfFourCodePointsWouldStartCDO } from './checks/four-code-points-would-start-cdo';
import { checkIfThreeCodePointsWouldStartAnIdentSequence } from './checks/three-code-points-would-start-ident-sequence';
import { checkIfThreeCodePointsWouldStartANumber } from './checks/three-code-points-would-start-number';
import { checkIfTwoCodePointsStartAComment } from './checks/two-code-points-start-comment';
import { checkIfThreeCodePointsWouldStartCDC } from './checks/three-code-points-would-start-cdc';
import { APOSTROPHE, CARRIAGE_RETURN, CHARACTER_TABULATION, COLON, COMMA, COMMERCIAL_AT, FORM_FEED, FULL_STOP, HYPHEN_MINUS, LATIN_CAPITAL_LETTER_U, LATIN_SMALL_LETTER_U, LEFT_CURLY_BRACKET, LEFT_PARENTHESIS, LEFT_SQUARE_BRACKET, LESS_THAN_SIGN, LINE_FEED, NUMBER_SIGN, PLUS_SIGN, QUOTATION_MARK, REVERSE_SOLIDUS, RIGHT_CURLY_BRACKET, RIGHT_PARENTHESIS, RIGHT_SQUARE_BRACKET, SEMICOLON, SOLIDUS, SPACE } from './code-points/code-points';
import { isDigitCodePoint, isIdentStartCodePoint } from './code-points/ranges';
import { consumeComment } from './consume/comment';
import { consumeHashToken } from './consume/hash-token';
import { consumeIdentSequence } from './consume/ident-sequence';
import { consumeNumericToken } from './consume/numeric-token';
import { consumeWhiteSpace } from './consume/whitespace-token';
import type { CSSToken} from './interfaces/token';
import { TokenType } from './interfaces/token';
import { Reader } from './reader';
import { consumeStringToken } from './consume/string-token';
import { consumeIdentLikeToken } from './consume/ident-like-token';
import { checkIfTwoCodePointsAreAValidEscape } from './checks/two-code-points-are-valid-escape';
import type { ParseError} from './interfaces/error';
import { ParseErrorMessage, ParseErrorWithToken } from './interfaces/error';
import { checkIfThreeCodePointsWouldStartAUnicodeRange } from './checks/three-code-points-would-start-unicode-range';
import { consumeUnicodeRangeToken } from './consume/unicode-range-token';

/**
 * Tokenize a CSS string into a list of tokens.
 */
export function tokenize(
	input: {
		css: { valueOf(): string },
		unicodeRangesAllowed?: boolean,
	},
	options?: {
		onParseError?: (error: ParseError) => void
	},
): Array<CSSToken> {
	const t = tokenizer(input, options);

	const tokens: Array<CSSToken> = [];

	while (!t.endOfFile()) {
		tokens.push(t.nextToken());
	}

	tokens.push(t.nextToken()); // EOF-token

	return tokens;
}

/**
 * Create a tokenizer for a CSS string.
 */
export function tokenizer(
	input: {
		css: {
			valueOf(): string
		},
		unicodeRangesAllowed?: boolean,
	},
	options?: {
		onParseError?: (error: ParseError) => void
	},
): { nextToken: () => CSSToken, endOfFile: () => boolean } {
	const css = input.css.valueOf();
	const unicodeRangesAllowed = input.unicodeRangesAllowed ?? false;

	const reader = new Reader(css);

	const ctx = {
		onParseError: options?.onParseError ?? noop,
	};

	function endOfFile(): boolean {
		return typeof reader.source.codePointAt(reader.cursor) === "undefined";
	}

	function nextToken(): CSSToken {
		reader.resetRepresentation();

		const peeked = reader.source.codePointAt(reader.cursor);
		if (typeof peeked === "undefined") {
			return [TokenType.EOF, '', -1, -1, undefined];
		}

		if (peeked === SOLIDUS && checkIfTwoCodePointsStartAComment(reader)) {
			return consumeComment(ctx, reader);
		}

		if (
			unicodeRangesAllowed && (
				peeked === LATIN_SMALL_LETTER_U ||
				peeked === LATIN_CAPITAL_LETTER_U
			) &&
			checkIfThreeCodePointsWouldStartAUnicodeRange(reader)
		) {
			return consumeUnicodeRangeToken(ctx, reader);
		}

		if (isIdentStartCodePoint(peeked)) {
			return consumeIdentLikeToken(ctx, reader);
		}

		if (isDigitCodePoint(peeked)) {
			return consumeNumericToken(ctx, reader);
		}

		// Simple, one character tokens:
		switch (peeked) {
			case COMMA:
				reader.advanceCodePoint();
				return [TokenType.Comma, ',', reader.representationStart, reader.representationEnd, undefined];

			case COLON:
				reader.advanceCodePoint();
				return [TokenType.Colon, ':', reader.representationStart, reader.representationEnd, undefined];

			case SEMICOLON:
				reader.advanceCodePoint();
				return [TokenType.Semicolon, ';', reader.representationStart, reader.representationEnd, undefined];

			case LEFT_PARENTHESIS:
				reader.advanceCodePoint();
				return [TokenType.OpenParen, '(', reader.representationStart, reader.representationEnd, undefined];

			case RIGHT_PARENTHESIS:
				reader.advanceCodePoint();
				return [TokenType.CloseParen, ')', reader.representationStart, reader.representationEnd, undefined];

			case LEFT_SQUARE_BRACKET:
				reader.advanceCodePoint();
				return [TokenType.OpenSquare, '[', reader.representationStart, reader.representationEnd, undefined];

			case RIGHT_SQUARE_BRACKET:
				reader.advanceCodePoint();
				return [TokenType.CloseSquare, ']', reader.representationStart, reader.representationEnd, undefined];

			case LEFT_CURLY_BRACKET:
				reader.advanceCodePoint();
				return [TokenType.OpenCurly, '{', reader.representationStart, reader.representationEnd, undefined];

			case RIGHT_CURLY_BRACKET:
				reader.advanceCodePoint();
				return [TokenType.CloseCurly, '}', reader.representationStart, reader.representationEnd, undefined];

			case APOSTROPHE:
			case QUOTATION_MARK:
				return consumeStringToken(ctx, reader);

			case NUMBER_SIGN:
				return consumeHashToken(ctx, reader);

			case PLUS_SIGN:
			case FULL_STOP:
				if (checkIfThreeCodePointsWouldStartANumber(reader)) {
					return consumeNumericToken(ctx, reader);
				}

				reader.advanceCodePoint();
				return [TokenType.Delim, reader.source[reader.representationStart], reader.representationStart, reader.representationEnd, {
					value: reader.source[reader.representationStart],
				}];

			case LINE_FEED:
			case CARRIAGE_RETURN:
			case FORM_FEED:
			case CHARACTER_TABULATION:
			case SPACE:
				return consumeWhiteSpace(reader);

			case HYPHEN_MINUS:
				if (checkIfThreeCodePointsWouldStartANumber(reader)) {
					return consumeNumericToken(ctx, reader);
				}

				if (checkIfThreeCodePointsWouldStartCDC(reader)) {
					reader.advanceCodePoint(3);

					return [TokenType.CDC, '-->', reader.representationStart, reader.representationEnd, undefined];
				}

				if (checkIfThreeCodePointsWouldStartAnIdentSequence(ctx, reader)) {
					return consumeIdentLikeToken(ctx, reader);
				}

				reader.advanceCodePoint();
				return [TokenType.Delim, '-', reader.representationStart, reader.representationEnd, {
					value: '-',
				}];

			case LESS_THAN_SIGN:
				if (checkIfFourCodePointsWouldStartCDO(reader)) {
					reader.advanceCodePoint(4);

					return [TokenType.CDO, '<!--', reader.representationStart, reader.representationEnd, undefined];
				}

				reader.advanceCodePoint();
				return [TokenType.Delim, '<', reader.representationStart, reader.representationEnd, {
					value: '<',
				}];

			case COMMERCIAL_AT:
				reader.advanceCodePoint();
				if (checkIfThreeCodePointsWouldStartAnIdentSequence(ctx, reader)) {
					const identSequence = consumeIdentSequence(ctx, reader);

					return [TokenType.AtKeyword, reader.source.slice(reader.representationStart, reader.representationEnd + 1), reader.representationStart, reader.representationEnd, {
						value: String.fromCodePoint(...identSequence),
					}];
				}

				return [TokenType.Delim, '@', reader.representationStart, reader.representationEnd, {
					value: '@',
				}];

			case REVERSE_SOLIDUS: {
				if (checkIfTwoCodePointsAreAValidEscape(reader)) {
					return consumeIdentLikeToken(ctx, reader);
				}

				reader.advanceCodePoint();

				const token: CSSToken = [TokenType.Delim, '\\', reader.representationStart, reader.representationEnd, {
					value: '\\',
				}];

				ctx.onParseError(new ParseErrorWithToken(
					ParseErrorMessage.InvalidEscapeSequenceAfterBackslash,
					reader.representationStart,
					reader.representationEnd,
					[
						'4.3.1. Consume a token',
						'U+005C REVERSE SOLIDUS (\\)',
						'The input stream does not start with a valid escape sequence',
					],
					token
				));

				return token;
			}
		}

		reader.advanceCodePoint();
		return [TokenType.Delim, reader.source[reader.representationStart], reader.representationStart, reader.representationEnd, {
			value: reader.source[reader.representationStart],
		}];
	}

	return {
		nextToken: nextToken,
		endOfFile: endOfFile,
	};
}

function noop(): void { /* do nothing */ }
