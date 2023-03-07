import { CSSToken, NumberType, TokenNumber, TokenType } from '@csstools/css-tokenizer';
import { ColorData, SyntaxFlag } from '../color-data';
import { toLowerCaseAZ } from '../util/to-lower-case-a-z';
import { normalize } from './normalize';

export function normalize_legacy_sRGB_ChannelValues(tokens: Array<CSSToken>, colorData: ColorData): Array<TokenNumber> | false {
	const result: Array<TokenNumber> = [];

	for (let index = 0; index < tokens.length; index++) {
		const token = tokens[index];

		if (token[0] === TokenType.Percentage) {
			if (index === 3) {
				colorData.syntaxFlags.add(SyntaxFlag.HasPercentageAlpha);
			} else {
				colorData.syntaxFlags.add(SyntaxFlag.HasPercentageValues);
			}

			const value = normalize(token[4].value, 100, 0, 1);

			result.push([
				TokenType.Number,
				value.toString(),
				token[2],
				token[3],
				{
					value: value,
					type: NumberType.Number,
				},
			]);
			continue;
		}

		if (token[0] === TokenType.Number) {
			if (index !== 3) {
				colorData.syntaxFlags.add(SyntaxFlag.HasNumberValues);
			}

			let value = normalize(token[4].value, 255, 0, 1);
			if (index === 3) {
				value = normalize(token[4].value, 1, 0, 1);
			}

			result.push([
				TokenType.Number,
				value.toString(),
				token[2],
				token[3],
				{
					value: value,
					type: NumberType.Number,
				},
			]);
			continue;
		}

		return false;
	}

	if (
		colorData.syntaxFlags.has(SyntaxFlag.HasNumberValues) &&
		colorData.syntaxFlags.has(SyntaxFlag.HasPercentageValues)
	) {
		return false;
	}

	return result;
}

export function normalize_modern_sRGB_ChannelValues(tokens: Array<CSSToken>, colorData: ColorData): Array<TokenNumber> | false {
	const result: Array<TokenNumber> = [];

	for (let index = 0; index < tokens.length; index++) {
		const token = tokens[index];

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

		if (token[0] === TokenType.Percentage) {
			if (index !== 3) {
				colorData.syntaxFlags.add(SyntaxFlag.HasPercentageValues);
			}

			const value = normalize(token[4].value, 100, 0, 1);

			result.push([
				TokenType.Number,
				value.toString(),
				token[2],
				token[3],
				{
					value: value,
					type: NumberType.Number,
				},
			]);
			continue;
		}

		if (token[0] === TokenType.Number) {
			if (index !== 3) {
				colorData.syntaxFlags.add(SyntaxFlag.HasNumberValues);
			}

			let value = normalize(token[4].value, 255, 0, 1);
			if (index === 3) {
				value = normalize(token[4].value, 1, 0, 1);
			}

			result.push([
				TokenType.Number,
				value.toString(),
				token[2],
				token[3],
				{
					value: value,
					type: NumberType.Number,
				},
			]);
			continue;
		}

		return false;
	}

	return result;
}
