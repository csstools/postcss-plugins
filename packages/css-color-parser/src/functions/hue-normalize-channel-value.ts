import type { TokenNumber } from '@csstools/css-tokenizer';
import { CSSToken, NumberType, TokenType, isTokenDimension, isTokenNumber } from '@csstools/css-tokenizer';
import { toLowerCaseAZ } from '../util/to-lower-case-a-z';

export function normalizeHue(token: CSSToken): TokenNumber | false {
	if (isTokenNumber(token)) {
		token[4].value = token[4].value % 360;
		token[1] = token[4].value.toString();
		return token;
	}

	if (isTokenDimension(token)) {
		let value = token[4].value;

		switch (toLowerCaseAZ(token[4].unit)) {
			case 'deg':
				break;
			case 'rad':
				// radians -> degrees
				value = token[4].value * 180 / Math.PI;
				break;

			case 'grad':
				// grades -> degrees
				value = token[4].value * 0.9;
				break;

			case 'turn':
				// turns -> degrees
				value = token[4].value * 360;
				break;
			default:
				return false;
		}

		value = value % 360;

		return [
			TokenType.Number,
			value.toString(),
			token[2],
			token[3],
			{
				value: value,
				type: NumberType.Number,
			},
		];
	}

	return false;
}
