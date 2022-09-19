import { REVERSE_SOLIDUS } from '../code-points/code-points';
import { isNewLine } from '../code-points/ranges';
import { CodePointReader } from '../interfaces/code-point-reader';
import { Context } from '../interfaces/context';
import { TokenBadString, TokenString, TokenType } from '../interfaces/token';
import { consumeEscapedCodePoint } from './escaped-code-point';

// https://www.w3.org/TR/2021/CRD-css-syntax-3-20211224/#consume-string-token
export function consumeStringToken(ctx: Context, reader: CodePointReader): TokenBadString|TokenString {
	let result = '';

	const first = reader.readCodePoint();
	if (first === false) {
		throw new Error('Unexpected EOF');
	}

	// eslint-disable-next-line no-constant-condition
	while (true) {
		const next = reader.readCodePoint();
		if (next === false) {
			return [TokenType.String, reader.representationString(), ...reader.representation(), { value: result }];
		}

		if (isNewLine(next)) {
			reader.unreadCodePoint();
			return [TokenType.BadString, reader.representationString(), ...reader.representation(), undefined];
		}

		if (next === first) {
			return [TokenType.String, reader.representationString(), ...reader.representation(), { value: result }];
		}

		if (next === REVERSE_SOLIDUS) {
			const peeked = reader.peekOneCodePoint();
			if (peeked === false) {
				continue;
			}

			if (isNewLine(peeked)) {
				reader.readCodePoint();
				continue;
			}

			result += String.fromCharCode(consumeEscapedCodePoint(ctx, reader));
			continue;
		}

		result += String.fromCharCode(next);
	}
}
