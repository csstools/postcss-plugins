import type { ColorData } from '../color-data';
import { CSSToken, NumberType, TokenType, isTokenIdent, isTokenNumber, isTokenPercentage } from '@csstools/css-tokenizer';
import { SyntaxFlag } from '../color-data';
import { normalize } from './normalize';
import { toLowerCaseAZ } from '../util/to-lower-case-a-z';

export function normalize_Lab_ChannelValues(token: CSSToken, index: number, colorData: ColorData): CSSToken | false {
	if (isTokenIdent(token) && toLowerCaseAZ(token[4].value) === 'none') {
		colorData.syntaxFlags.add(SyntaxFlag.HasNoneKeywords);

		return [
			TokenType.Number,
			'none',
			token[2],
			token[3],
			{
				value: NaN,
				type: NumberType.Number,
			},
		];
	}

	if (isTokenPercentage(token)) {
		if (index !== 3) {
			colorData.syntaxFlags.add(SyntaxFlag.HasPercentageValues);
		}

		let value = normalize(token[4].value, 1, 0, 100);
		if (index === 1 || index === 2) {
			value = normalize(token[4].value, 0.8, -2_147_483_647, 2_147_483_647);
		} else if (index === 3) {
			value = normalize(token[4].value, 100, 0, 1);
		}

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

	if (isTokenNumber(token)) {
		if (index !== 3) {
			colorData.syntaxFlags.add(SyntaxFlag.HasNumberValues);
		}

		let value = normalize(token[4].value, 1, 0, 100);
		if (index === 1 || index === 2) {
			value = normalize(token[4].value, 1, -2_147_483_647, 2_147_483_647);
		} else if (index === 3) {
			value = normalize(token[4].value, 1, 0, 1);
		}

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
