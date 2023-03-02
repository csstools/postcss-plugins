import { CSSToken, NumberType, TokenNumber, TokenType } from '@csstools/css-tokenizer';
import { ColorData, SyntaxFlag } from '../color-data';
import { normalizeHue } from './hue-normalize-channel-value';

export function normalize_legacy_HSL_ChannelValues(tokens: Array<CSSToken>, colorData: ColorData): Array<TokenNumber> | -1 {
	const result: Array<TokenNumber> = [];

	for (let index = 0; index < tokens.length; index++) {
		const token = tokens[index];

		if (index === 0) {
			const hueToken = normalizeHue(token);
			if (hueToken === -1) {
				return -1;
			}

			if (token[0] === TokenType.Dimension) {
				colorData.syntaxFlags.add(SyntaxFlag.HasDimensionValues);
			}

			result.push(hueToken);
			continue;
		}

		if (token[0] === TokenType.Percentage) {
			if (index === 3) {
				colorData.syntaxFlags.add(SyntaxFlag.HasPercentageAlpha);
			} else {
				colorData.syntaxFlags.add(SyntaxFlag.HasPercentageValues);
			}

			let scale = 1;
			if (index === 3) {
				scale = 100;
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

		if (token[0] === TokenType.Number) {
			if (index !== 3) {
				colorData.syntaxFlags.add(SyntaxFlag.HasNumberValues);
			}

			let scale = 1;
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

	if (colorData.syntaxFlags.has(SyntaxFlag.HasNumberValues)) {
		return -1;
	}

	return result;
}

export function normalize_modern_HSL_ChannelValues(tokens: Array<CSSToken>, colorData: ColorData): Array<TokenNumber> | -1 {
	const result: Array<TokenNumber> = [];

	for (let index = 0; index < tokens.length; index++) {
		const token = tokens[index];

		if (token[0] === TokenType.Ident && token[4].value.toLowerCase() === 'none') {
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

		if (index === 0) {
			const hueToken = normalizeHue(token);
			if (hueToken === -1) {
				return -1;
			}

			if (token[0] === TokenType.Dimension) {
				colorData.syntaxFlags.add(SyntaxFlag.HasDimensionValues);
			}

			result.push(hueToken);
			continue;
		}

		if (token[0] === TokenType.Percentage) {
			if (index === 3) {
				colorData.syntaxFlags.add(SyntaxFlag.HasPercentageAlpha);
			} else {
				colorData.syntaxFlags.add(SyntaxFlag.HasPercentageValues);
			}

			let scale = 1;
			if (index === 3) {
				scale = 100;
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

		if (token[0] === TokenType.Number) {
			if (index !== 3) {
				colorData.syntaxFlags.add(SyntaxFlag.HasNumberValues);
			}

			let scale = 1;
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

	if (colorData.syntaxFlags.has(SyntaxFlag.HasNumberValues)) {
		return -1;
	}

	return result;
}
