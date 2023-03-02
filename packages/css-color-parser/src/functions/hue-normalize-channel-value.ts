import { CSSToken, NumberType, TokenNumber, TokenType } from '@csstools/css-tokenizer';

export function normalizeHue(token : CSSToken): TokenNumber | -1 {
	if (token[0] === TokenType.Number) {
		token[4].value = token[4].value % 360;
		token[1] = token[4].value.toString();
		return token;
	}

	if (token[0] === TokenType.Dimension) {
		let value = token[4].value;

		switch (token[4].unit.toLowerCase()) {
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
				return -1;
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

	return -1;
}
