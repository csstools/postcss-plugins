import { checkIfFourCodePointsWouldStartCDO } from './checks/four-code-points-would-start-cdo';
import { checkIfThreeCodePointsWouldStartAnIdentSequence } from './checks/three-code-points-would-start-ident-sequence';
import { checkIfThreeCodePointsWouldStartANumber } from './checks/three-code-points-would-start-number';
import { checkIfTwoCodePointsStartAComment } from './checks/two-code-points-start-comment';
import { checkIfThreeCodePointsWouldStartCDC } from './checks/three-code-points-would-start-cdc';
import { APOSTROPHE, CARRIAGE_RETURN, CHARACTER_TABULATION, COLON, COMMA, COMMERCIAL_AT, DIGIT_0, DIGIT_1, DIGIT_2, DIGIT_3, DIGIT_4, DIGIT_5, DIGIT_6, DIGIT_7, DIGIT_8, DIGIT_9, FORM_FEED, FULL_STOP, HYPHEN_MINUS, LEFT_CURLY_BRACKET, LEFT_PARENTHESIS, LEFT_SQUARE_BRACKET, LESS_THAN_SIGN, LINE_FEED, NUMBER_SIGN, PLUS_SIGN, QUOTATION_MARK, REVERSE_SOLIDUS, RIGHT_CURLY_BRACKET, RIGHT_PARENTHESIS, RIGHT_SQUARE_BRACKET, SEMICOLON, SPACE } from './code-points/code-points';
import { isIdentStartCodePoint } from './code-points/ranges';
import { consumeComment } from './consume/comment';
import { consumeHashToken } from './consume/hash-token';
import { consumeIdentSequence } from './consume/ident-sequence';
import { consumeNumericToken } from './consume/numeric-token';
import { consumeWhiteSpace } from './consume/whitespace-token';
import { CSSToken, TokenType } from './interfaces/token';
import { Reader } from './reader';
import { consumeStringToken } from './consume/string-token';
import { consumeIdentLikeToken } from './consume/ident-like-token';
import { checkIfTwoCodePointsAreAValidEscape } from './checks/two-code-points-are-valid-escape';
import { ParserError } from './interfaces/error';

interface Stringer {
	valueOf(): string
}

export function tokenizer(input: { css: Stringer }, options?: { commentsAreTokens?: boolean, onParseError?: (error: ParserError) => void }) {
	const css = input.css.valueOf();

	const reader = new Reader(css);

	const ctx = {
		onParseError: options?.onParseError ?? (() => { /* noop */ }),
	};

	function endOfFile() {
		return reader.codePointSource[reader.cursor] === undefined;
	}

	function nextToken(): CSSToken | undefined {
		reader.resetRepresentation();

		if (checkIfTwoCodePointsStartAComment(ctx, reader)) {
			if (options?.commentsAreTokens) {
				return consumeComment(ctx, reader);
			} else {
				consumeComment(ctx, reader);
				reader.resetRepresentation();
			}
		}

		const peeked = reader.codePointSource[reader.cursor];
		if (peeked === undefined) {
			return [TokenType.EOF, '', -1, -1, undefined];
		}

		if (isIdentStartCodePoint(peeked)) {
			return consumeIdentLikeToken(ctx, reader);
		}

		// Simple, one character tokens:
		switch (peeked) {
			case COMMA: {
				reader.readCodePoint();
				return [TokenType.Comma, reader.representationString(), reader.representationStart, reader.representationEnd, undefined];
			}
			case COLON: {
				reader.readCodePoint();
				return [TokenType.Colon, reader.representationString(), reader.representationStart, reader.representationEnd, undefined];
			}
			case SEMICOLON: {
				reader.readCodePoint();
				return [TokenType.Semicolon, reader.representationString(), reader.representationStart, reader.representationEnd, undefined];
			}
			case LEFT_PARENTHESIS: {
				reader.readCodePoint();
				return [TokenType.OpenParen, reader.representationString(), reader.representationStart, reader.representationEnd, undefined];
			}
			case RIGHT_PARENTHESIS: {
				reader.readCodePoint();
				return [TokenType.CloseParen, reader.representationString(), reader.representationStart, reader.representationEnd, undefined];
			}
			case LEFT_SQUARE_BRACKET: {
				reader.readCodePoint();
				return [TokenType.OpenSquare, reader.representationString(), reader.representationStart, reader.representationEnd, undefined];
			}
			case RIGHT_SQUARE_BRACKET: {
				reader.readCodePoint();
				return [TokenType.CloseSquare, reader.representationString(), reader.representationStart, reader.representationEnd, undefined];
			}
			case LEFT_CURLY_BRACKET: {
				reader.readCodePoint();
				return [TokenType.OpenCurly, reader.representationString(), reader.representationStart, reader.representationEnd, undefined];
			}
			case RIGHT_CURLY_BRACKET: {
				reader.readCodePoint();
				return [TokenType.CloseCurly, reader.representationString(), reader.representationStart, reader.representationEnd, undefined];
			}
			case APOSTROPHE:
			case QUOTATION_MARK:
				return consumeStringToken(ctx, reader);
			case NUMBER_SIGN:
				return consumeHashToken(ctx, reader);

			case PLUS_SIGN:
			case FULL_STOP: {
				if (checkIfThreeCodePointsWouldStartANumber(ctx, reader)) {
					return consumeNumericToken(ctx, reader);
				}

				reader.readCodePoint();
				return [TokenType.Delim, reader.representationString(), reader.representationStart, reader.representationEnd, {
					value: String.fromCharCode(peeked),
				}];
			}
			case DIGIT_0:
			case DIGIT_1:
			case DIGIT_2:
			case DIGIT_3:
			case DIGIT_4:
			case DIGIT_5:
			case DIGIT_6:
			case DIGIT_7:
			case DIGIT_8:
			case DIGIT_9:
				return consumeNumericToken(ctx, reader);

			case LINE_FEED:
			case CARRIAGE_RETURN:
			case FORM_FEED:
			case CHARACTER_TABULATION:
			case SPACE:
				return consumeWhiteSpace(ctx, reader);

			case HYPHEN_MINUS: {
				if (checkIfThreeCodePointsWouldStartANumber(ctx, reader)) {
					return consumeNumericToken(ctx, reader);
				}

				if (checkIfThreeCodePointsWouldStartCDC(ctx, reader)) {
					reader.readCodePoint(3);

					return [TokenType.CDC, reader.representationString(), reader.representationStart, reader.representationEnd, undefined];
				}

				if (checkIfThreeCodePointsWouldStartAnIdentSequence(ctx, reader)) {
					return consumeIdentLikeToken(ctx, reader);
				}

				reader.readCodePoint();
				return [TokenType.Delim, reader.representationString(), reader.representationStart, reader.representationEnd, {
					value: '-',
				}];
			}

			case LESS_THAN_SIGN: {
				if (checkIfFourCodePointsWouldStartCDO(ctx, reader)) {
					reader.readCodePoint(4);

					return [TokenType.CDO, reader.representationString(), reader.representationStart, reader.representationEnd, undefined];
				}

				reader.readCodePoint();
				return [TokenType.Delim, reader.representationString(), reader.representationStart, reader.representationEnd, {
					value: '<',
				}];
			}

			case COMMERCIAL_AT: {
				reader.readCodePoint();
				if (checkIfThreeCodePointsWouldStartAnIdentSequence(ctx, reader)) {
					const identSequence = consumeIdentSequence(ctx, reader);

					return [TokenType.AtKeyword, reader.representationString(), reader.representationStart, reader.representationEnd, {
						value: String.fromCharCode(...identSequence),
					}];
				}

				return [TokenType.Delim, reader.representationString(), reader.representationStart, reader.representationEnd, {
					value: '@',
				}];
			}

			case REVERSE_SOLIDUS: {
				if (checkIfTwoCodePointsAreAValidEscape(ctx, reader)) {
					return consumeIdentLikeToken(ctx, reader);
				}

				reader.readCodePoint();

				ctx.onParseError({
					message: 'Invalid escape sequence after "\\"',
					start: reader.representationStart,
					end: reader.representationEnd,
					state: [
						'4.3.1. Consume a token',
						'U+005C REVERSE SOLIDUS (\\)',
						'The input stream does not start with a valid escape sequence',
					],
				});

				return [TokenType.Delim, reader.representationString(), reader.representationStart, reader.representationEnd, {
					value: '\\',
				}];
			}
		}

		reader.readCodePoint();
		return [TokenType.Delim, reader.representationString(), reader.representationStart, reader.representationEnd, {
			value: String.fromCharCode(peeked),
		}];
	}

	return {
		nextToken: nextToken,
		endOfFile: endOfFile,
	};
}
