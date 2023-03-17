import type { ColorData } from '../color-data';
import type { TokenNumber } from '@csstools/css-tokenizer';
import { CSSToken, NumberType, TokenType } from '@csstools/css-tokenizer';
import { SyntaxFlag } from '../color-data';
import { normalize } from './normalize';
import { normalizeHue } from './hue-normalize-channel-value';
import { toLowerCaseAZ } from '../util/to-lower-case-a-z';

export function normalize_LCH_ChannelValues(tokens: Array<CSSToken>, colorData: ColorData): Array<TokenNumber> | false {
	const result: Array<TokenNumber> = [];

	for (let index = 0; index < tokens.length; index++) {
		const token = tokens[index];

		if (token[0] === TokenType.Ident && toLowerCaseAZ(token[4].value) === 'none') {
			colorData.syntaxFlags.add(SyntaxFlag.HasNoneKeywords);

			result.push([
				TokenType.Number,
				'none',
				token[2],
				token[3],
				{
					value: NaN,
					type: NumberType.Number,
				},
			]);
			continue;
		}

		if (index === 2) {
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
			if (index !== 3) {
				colorData.syntaxFlags.add(SyntaxFlag.HasPercentageValues);
			}

			let value = normalize(token[4].value, 1, 0, 100);
			if (index === 1) {
				value = normalize(token[4].value, (100 / 150), 0, Infinity);
			} else if (index === 3) {
				value = normalize(token[4].value, 100, 0, 1);
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

		if (token[0] === TokenType.Number) {
			if (index !== 3) {
				colorData.syntaxFlags.add(SyntaxFlag.HasNumberValues);
			}

			let value = normalize(token[4].value, 1, 0, 100);
			if (index === 1) {
				value = normalize(token[4].value, 1, 0, Infinity);
			} else if (index === 3) {
				value = normalize(token[4].value, 1, 0, 1);
			}

			result.push([
				TokenType.Number,
				value.toString(),
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
