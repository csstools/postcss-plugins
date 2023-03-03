import { CSSToken, NumberType, TokenNumber, TokenType } from '@csstools/css-tokenizer';
import { ColorData, SyntaxFlag } from '../color-data';
import { toLowerCaseAZ } from '../util/to-lower-case-a-z';

export function normalize_legacy_sRGB_ChannelValues(tokens: Array<CSSToken>, colorData: ColorData): Array<TokenNumber> | -1 {
	const result: Array<TokenNumber> = [];

	for (let index = 0; index < tokens.length; index++) {
		const token = tokens[index];

		if (token[0] === TokenType.Percentage) {
			if (index === 3) {
				colorData.syntaxFlags.add(SyntaxFlag.HasPercentageAlpha);
			} else {
				colorData.syntaxFlags.add(SyntaxFlag.HasPercentageValues);
			}

			result.push([
				TokenType.Number,
				(token[4].value / 100).toString(),
				token[2],
				token[3],
				{
					value: token[4].value / 100,
					type: NumberType.Number,
				},
			]);
			continue;
		}

		if (token[0] === TokenType.Number) {
			if (index !== 3) {
				colorData.syntaxFlags.add(SyntaxFlag.HasNumberValues);
			}

			let scale = 255;
			if (index === 3) {
				scale = 1;
			}

			result.push([
				TokenType.Number,
				(token[4].value / scale).toString(),
				token[2],
				token[3],
				{
					value: token[4].value / scale,
					type: NumberType.Number,
				},
			]);
			continue;
		}

		return -1;
	}

	if (
		colorData.syntaxFlags.has(SyntaxFlag.HasNumberValues) &&
		colorData.syntaxFlags.has(SyntaxFlag.HasPercentageValues)
	) {
		return -1;
	}

	return result;
}

export function normalize_modern_sRGB_ChannelValues(tokens: Array<CSSToken>, colorData: ColorData): Array<TokenNumber> | -1 {
	const result: Array<TokenNumber> = [];

	for (let index = 0; index < tokens.length; index++) {
		const token = tokens[index];

		if (token[0] === TokenType.Percentage) {
			if (index !== 3) {
				colorData.syntaxFlags.add(SyntaxFlag.HasPercentageValues);
			}

			result.push([
				TokenType.Number,
				(token[4].value / 100).toString(),
				token[2],
				token[3],
				{
					value: token[4].value / 100,
					type: NumberType.Number,
				},
			]);
			continue;
		}

		if (token[0] === TokenType.Number) {
			if (index !== 3) {
				colorData.syntaxFlags.add(SyntaxFlag.HasNumberValues);
			}

			let scale = 255;
			if (index === 3) {
				scale = 1;
			}

			result.push([
				TokenType.Number,
				(token[4].value / scale).toString(),
				token[2],
				token[3],
				{
					value: token[4].value / scale,
					type: NumberType.Number,
				},
			]);
			continue;
		}

		if (token[0] === TokenType.Ident && toLowerCaseAZ(token[4].value) === 'none') {
			colorData.syntaxFlags.add(SyntaxFlag.HasNoneKeywords);
			colorData.missingComponents[index] = true;

			result.push([
				TokenType.Number,
				'0',
				token[2],
				token[3],
				{
					value: 0,
					type: NumberType.Number,
				},
			]);
			continue;
		}

		return -1;
	}

	return result;
}
