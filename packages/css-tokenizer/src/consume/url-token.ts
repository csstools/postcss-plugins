import { checkIfTwoCodePointsAreAValidEscape } from '../checks/two-code-points-are-valid-escape';
import { APOSTROPHE, LEFT_PARENTHESIS, QUOTATION_MARK, REVERSE_SOLIDUS, RIGHT_PARENTHESIS } from '../code-points/code-points';
import { isNonPrintableCodePoint, isWhitespace } from '../code-points/ranges';
import { CodePointReader } from '../interfaces/code-point-reader';
import { TokenBadURL, TokenType, TokenURL } from '../interfaces/token';
import { consumeBadURL } from './bad-url';
import { consumeEscapedCodePoint } from './escaped-code-point';
import { consumeWhiteSpace } from './whitespace-token';

// https://www.w3.org/TR/2021/CRD-css-syntax-3-20211224/#consume-url-token
export function consumeUrlToken(reader: CodePointReader): TokenURL|TokenBadURL {
	consumeWhiteSpace(reader);
	let string = '';

	// eslint-disable-next-line no-constant-condition
	while (true) {
		const peeked = reader.peekOneCodePoint();
		if (peeked === false) {
			return [
				TokenType.URL,
				reader.representationString(),
				...reader.representation(),
				{
					value: string,
				},
			];
		}

		if (peeked === RIGHT_PARENTHESIS) {
			reader.readCodePoint();
			return [
				TokenType.URL,
				reader.representationString(),
				...reader.representation(),
				{
					value: string,
				},
			];
		}

		if (isWhitespace(peeked)) {
			consumeWhiteSpace(reader);
			const peeked2 = reader.peekOneCodePoint();
			if (peeked2 === false || peeked2 === RIGHT_PARENTHESIS) {
				// see above
				continue;
			}

			consumeBadURL(reader);
			return [
				TokenType.BadURL,
				reader.representationString(),
				...reader.representation(),
				undefined,
			];
		}

		if (peeked === QUOTATION_MARK || peeked === APOSTROPHE || peeked === LEFT_PARENTHESIS || isNonPrintableCodePoint(peeked)) {
			consumeBadURL(reader);
			return [
				TokenType.BadURL,
				reader.representationString(),
				...reader.representation(),
				undefined,
			];
		}

		if (peeked === REVERSE_SOLIDUS) {
			if (checkIfTwoCodePointsAreAValidEscape(reader)) {
				string += String.fromCharCode(consumeEscapedCodePoint(reader));
				continue;
			}

			consumeBadURL(reader);
			return [
				TokenType.BadURL,
				reader.representationString(),
				...reader.representation(),
				undefined,
			];
		}

		reader.readCodePoint();
		string += String.fromCharCode(peeked);
	}
}
