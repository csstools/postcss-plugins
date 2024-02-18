import type { ColorData } from '../color-data';
import { CSSToken, NumberType, TokenType } from '@csstools/css-tokenizer';
import { SyntaxFlag } from '../color-data';
import { normalize } from './normalize';
import { normalizeHue } from './hue-normalize-channel-value';
import { toLowerCaseAZ } from '../util/to-lower-case-a-z';

export function normalize_legacy_HSL_ChannelValues(token: CSSToken, index: number, colorData: ColorData): CSSToken | false {
	if (index === 0) {
		const hueToken = normalizeHue(token);
		if (hueToken === false) {
			return false;
		}

		if (token[0] === TokenType.Dimension) {
			colorData.syntaxFlags.add(SyntaxFlag.HasDimensionValues);
		}

		return hueToken;
	}

	if (token[0] === TokenType.Percentage) {
		if (index === 3) {
			colorData.syntaxFlags.add(SyntaxFlag.HasPercentageAlpha);
		} else {
			colorData.syntaxFlags.add(SyntaxFlag.HasPercentageValues);
		}

		let value = normalize(token[4].value, 1, 0, 100);
		if (index === 3) {
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

	if (token[0] === TokenType.Number) {
		if (index !== 3) {
			return false;
		}

		let value = normalize(token[4].value, 1, 0, 100);
		if (index === 3) {
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

export function normalize_modern_HSL_ChannelValues(token: CSSToken, index: number, colorData: ColorData): CSSToken | false {
	if (token[0] === TokenType.Ident && toLowerCaseAZ(token[4].value) === 'none') {
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

	if (index === 0) {
		const hueToken = normalizeHue(token);
		if (hueToken === false) {
			return false;
		}

		if (token[0] === TokenType.Dimension) {
			colorData.syntaxFlags.add(SyntaxFlag.HasDimensionValues);
		}

		return hueToken;
	}

	if (token[0] === TokenType.Percentage) {
		if (index === 3) {
			colorData.syntaxFlags.add(SyntaxFlag.HasPercentageAlpha);
		} else {
			colorData.syntaxFlags.add(SyntaxFlag.HasPercentageValues);
		}

		let value = token[4].value;
		if (index === 3) {
			value = normalize(token[4].value, 100, 0, 1);
		} else if (index === 1) {
			value = normalize(token[4].value, 1, 0, Infinity);
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

	if (token[0] === TokenType.Number) {
		if (index !== 3) {
			colorData.syntaxFlags.add(SyntaxFlag.HasNumberValues);
		}

		let value = token[4].value;
		if (index === 3) {
			value = normalize(token[4].value, 1, 0, 1);
		} else if (index === 1) {
			value = normalize(token[4].value, 1, 0, Infinity);
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
