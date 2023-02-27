import { CSSToken, NumberType, TokenNumber, TokenType } from '@csstools/css-tokenizer';

export type normalizeChannelValueFn = (token: CSSToken, index: number) => TokenNumber | -1;

export function normalize_sRGB_ChannelValue(token: CSSToken, index: number): TokenNumber | -1 {
	if (token[0] === TokenType.Percentage) {
		return [
			TokenType.Number,
			(token[4].value / 100).toString(),
			token[2],
			token[3],
			{
				value: token[4].value / 100,
				type: NumberType.Number,
			},
		];
	}

	if (token[0] === TokenType.Number) {
		let scale = 255;
		if (index === 3) {
			scale = 1;
		}

		return[
			TokenType.Number,
			(token[4].value / scale).toString(),
			token[2],
			token[3],
			{
				value: token[4].value / scale,
				type: NumberType.Number,
			},
		];
	}

	return -1;
}
