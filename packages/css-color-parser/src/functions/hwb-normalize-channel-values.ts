import { CSSToken, NumberType, TokenNumber, TokenType } from '@csstools/css-tokenizer';
import { ColorData, SyntaxFlag } from '../color-data';
import { toLowerCaseAZ } from '../util/to-lower-case-a-z';
import { normalizeHue } from './hue-normalize-channel-value';

export function normalize_modern_HWB_ChannelValues(tokens: Array<CSSToken>, colorData: ColorData): Array<TokenNumber> | false {
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

		if (index === 0) {
			const hueToken = normalizeHue(token);
			if (hueToken === false) {
				return false;
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
				return false;
			}

			result.push([
				TokenType.Number,
				token[1],
				token[2],
				token[3],
				{
					value: token[4].value,
					type: NumberType.Number,
				},
			]);
			continue;
		}

		return false;
	}

	return result;
}
