import { checkIfThreeCodePointsWouldStartCDO } from './checks/three-code-points-would-start-cdo';
import { checkIfThreeCodePointsWouldStartANumber } from './checks/three-code-points-would-start-number';
import { checkIfTwoCodePointsStartAComment } from './checks/two-code-points-start-comment';
import { COLON, COMMA, FULL_STOP, LEFT_CURLY_BRACKET, LEFT_PARENTHESIS, LEFT_SQUARE_BRACKET, LESS_THAN_SIGN, NUMBER_SIGN, PLUS_SIGN, RIGHT_CURLY_BRACKET, RIGHT_PARENTHESIS, RIGHT_SQUARE_BRACKET, SEMICOLON, SOLIDUS } from './code-points/code-points';
import { isWhitespace } from './code-points/ranges';
import { consumeComment } from './consume/comment';
import { consumeHashToken } from './consume/hash-token';
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
		{
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
		}

		switch (peeked) {
			case NUMBER_SIGN:
				return consumeHashToken(reader);

			case PLUS_SIGN:
			case FULL_STOP: {
				if (checkIfThreeCodePointsWouldStartANumber(reader)) {
					return consumeNumericToken(reader);
				}

				return [TokenType.Delim, reader.representationString(), ...reader.representation(), {
					value: String.fromCharCode(peeked),
				}];
			}

			case LESS_THAN_SIGN: {
				reader.readCodePoint();

				if (checkIfThreeCodePointsWouldStartCDO(reader)) {
					reader.readCodePoint();
					reader.readCodePoint();
					reader.readCodePoint();

					return [TokenType.CDO, reader.representationString(), ...reader.representation()];
				}

				return [TokenType.Delim, reader.representationString(), ...reader.representation(), {
					value: '<',
				}];
			}

			default:
				break;
		}

		if (isWhitespace(peeked)) {
			return consumeWhiteSpace(reader);
		}
	}

	return {
		nextToken,
	};
}
