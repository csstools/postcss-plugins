import type { ColorData } from '../color-data';
import type { CSSToken} from '@csstools/css-tokenizer';
import { NumberType, TokenType, isTokenIdent, isTokenNumber, isTokenPercentage } from '@csstools/css-tokenizer';
import { SyntaxFlag } from '../color-data';
import { normalize } from './normalize';
import { toLowerCaseAZ } from '../util/to-lower-case-a-z';
import { VALUE_FOR_NEGATIVE_INFINITY, VALUE_FOR_POSITIVE_INFINITY } from '../util/infinity-constants';

export function normalize_Color_ChannelValues(token: CSSToken, index: number, colorData: ColorData): CSSToken | false {
	if (isTokenIdent(token) && toLowerCaseAZ(token[4].value) === 'none') {
		colorData.syntaxFlags.add(SyntaxFlag.HasNoneKeywords);

		return [
			TokenType.Number,
			'none',
			token[2],
			token[3],
			{
				value: Number.NaN,
				type: NumberType.Number,
			},
		];
	}

	if (isTokenPercentage(token)) {
		if (index !== 3) {
			colorData.syntaxFlags.add(SyntaxFlag.HasPercentageValues);
		}

		let value;
		if (index === 3) {
			value = normalize(token[4].value, 100, 0, 1);
		} else {
			value = normalize(token[4].value, 100, VALUE_FOR_NEGATIVE_INFINITY, VALUE_FOR_POSITIVE_INFINITY);
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

		let value;
		if (index === 3) {
			value = normalize(token[4].value, 1, 0, 1);
		} else {
			value = normalize(token[4].value, 1, VALUE_FOR_NEGATIVE_INFINITY, VALUE_FOR_POSITIVE_INFINITY);
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
