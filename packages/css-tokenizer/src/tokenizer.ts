import { checkIfFourCodePointsWouldStartCDO } from './checks/four-code-points-would-start-cdo';
import { checkIfThreeCodePointsWouldStartAnIdentSequence } from './checks/three-code-points-would-start-ident-sequence';
import { checkIfThreeCodePointsWouldStartANumber } from './checks/three-code-points-would-start-number';
import { checkIfTwoCodePointsStartAComment } from './checks/two-code-points-start-comment';
import { checkIfThreeCodePointsWouldStartCDC } from './checks/three-code-points-would-start-cdc';
import { COLON, COMMA, COMMERCIAL_AT, FULL_STOP, HYPHEN_MINUS, LEFT_CURLY_BRACKET, LEFT_PARENTHESIS, LEFT_SQUARE_BRACKET, LESS_THAN_SIGN, NUMBER_SIGN, PLUS_SIGN, RIGHT_CURLY_BRACKET, RIGHT_PARENTHESIS, RIGHT_SQUARE_BRACKET, SEMICOLON, SOLIDUS } from './code-points/code-points';
import { isDigitCodePoint, isWhitespace } from './code-points/ranges';
import { consumeComment } from './consume/comment';
import { consumeHashToken } from './consume/hash-token';
import { consumeIdentSequence } from './consume/ident-sequence';
import { consumeNumericToken } from './consume/numeric-token';
import { consumeWhiteSpace } from './consume/whitespace';
import { CSSToken, TokenType } from './interfaces/token';
import { Reader } from './reader';

interface Stringer {
	valueOf(): string
}

export function tokenizer(input: { css: Stringer }, options?: { commentsAreTokens?: false }) {
	const css = input.css.valueOf();

	const reader = new Reader(css);

	function nextToken(): CSSToken | undefined {
		reader.resetRepresentation();

		if (checkIfTwoCodePointsStartAComment(reader)) {
			if (options?.commentsAreTokens) {
				return consumeComment(reader);
			} else {
				consumeComment(reader);
			}
		}

		reader.resetRepresentation();

		const peeked = reader.peekOneCodePoint();
		if (peeked === false) {
			return [TokenType.EOF, '', -1, -1];
		}

		// Simple, one character tokens:
		switch (peeked) {
			case COMMA:
				reader.readCodePoint();
				return [TokenType.Comma, reader.representationString(), ...reader.representation()];
			case COLON:
				reader.readCodePoint();
				return [TokenType.Colon, reader.representationString(), ...reader.representation()];
			case SEMICOLON:
				reader.readCodePoint();
				return [TokenType.Semicolon, reader.representationString(), ...reader.representation()];
			case LEFT_PARENTHESIS:
				reader.readCodePoint();
				return [TokenType.OpenParen, reader.representationString(), ...reader.representation()];
			case RIGHT_PARENTHESIS:
				reader.readCodePoint();
				return [TokenType.CloseParen, reader.representationString(), ...reader.representation()];
			case LEFT_SQUARE_BRACKET:
				reader.readCodePoint();
				return [TokenType.OpenSquare, reader.representationString(), ...reader.representation()];
			case RIGHT_SQUARE_BRACKET:
				reader.readCodePoint();
				return [TokenType.CloseSquare, reader.representationString(), ...reader.representation()];
			case LEFT_CURLY_BRACKET:
				reader.readCodePoint();
				return [TokenType.OpenCurly, reader.representationString(), ...reader.representation()];
			case RIGHT_CURLY_BRACKET:
				reader.readCodePoint();
				return [TokenType.CloseCurly, reader.representationString(), ...reader.representation()];
			default:
				break;
		}

		switch (peeked) {
			case NUMBER_SIGN:
				return consumeHashToken(reader);

			case PLUS_SIGN:
			case FULL_STOP: {
				if (checkIfThreeCodePointsWouldStartANumber(reader)) {
					return consumeNumericToken(reader);
				}

				reader.readCodePoint();
				return [TokenType.Delim, reader.representationString(), ...reader.representation(), {
					value: String.fromCharCode(peeked),
				}];
			}

			case HYPHEN_MINUS: {
				if (checkIfThreeCodePointsWouldStartANumber(reader)) {
					return consumeNumericToken(reader);
				}

				if (checkIfThreeCodePointsWouldStartCDC(reader)) {
					reader.readCodePoint();
					reader.readCodePoint();
					reader.readCodePoint();

					return [TokenType.CDC, reader.representationString(), ...reader.representation()];
				}

				if (checkIfThreeCodePointsWouldStartAnIdentSequence(reader)) {
					// return consumeIdentLike...
				}

				reader.readCodePoint();
				return [TokenType.Delim, reader.representationString(), ...reader.representation(), {
					value: '-',
				}];
			}

			case LESS_THAN_SIGN: {
				if (checkIfFourCodePointsWouldStartCDO(reader)) {
					reader.readCodePoint();
					reader.readCodePoint();
					reader.readCodePoint();
					reader.readCodePoint();

					return [TokenType.CDO, reader.representationString(), ...reader.representation()];
				}

				reader.readCodePoint();
				return [TokenType.Delim, reader.representationString(), ...reader.representation(), {
					value: '<',
				}];
			}

			case COMMERCIAL_AT: {
				reader.readCodePoint();
				if (checkIfThreeCodePointsWouldStartAnIdentSequence(reader)) {
					const identSequence = consumeIdentSequence(reader);

					return [TokenType.AtKeyword, reader.representationString(), ...reader.representation(), {
						value: identSequence.map((x) => String.fromCharCode(x)).join(''),
					}];
				}

				return [TokenType.Delim, reader.representationString(), ...reader.representation(), {
					value: '@',
				}];
			}

			default:
				break;
		}

		if (isWhitespace(peeked)) {
			return consumeWhiteSpace(reader);
		}

		if (isDigitCodePoint(peeked)) {
			return consumeNumericToken(reader);
		}

		reader.readCodePoint();
		return [TokenType.Delim, reader.representationString(), ...reader.representation(), {
			value: String.fromCharCode(peeked),
		}];
	}

	return {
		nextToken,
	};
}
