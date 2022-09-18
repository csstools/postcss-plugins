import { checkIfThreeCodePointsWouldStartCDO } from './checks/three-code-points-would-start-cdo';
import { COLON, COMMA, LEFT_CURLY_BRACKET, LEFT_PARENTHESIS, LEFT_SQUARE_BRACKET, LESS_THAN_SIGN, NUMBER_SIGN, RIGHT_CURLY_BRACKET, RIGHT_PARENTHESIS, RIGHT_SQUARE_BRACKET, SEMICOLON } from './code-points/code-points';
import { isWhitespace } from './code-points/ranges';
import { consumeHashToken } from './consume/hash-token';
import { consumeWhiteSpace } from './consume/whitespace';
import { CSSToken, TokenType } from './interfaces/token';
import { Reader } from './reader';

interface Stringer {
	valueOf(): string
}

export function tokenizer(input: { css: Stringer }) {
	const css = input.css.valueOf();

	const reader = new Reader(css);

	function nextToken(): CSSToken|undefined {
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
