import { NumberType, tokenize } from '@csstools/css-tokenizer';
import { TokenType } from '@csstools/css-tokenizer';
import { FunctionNode, TokenNode, parseCommaSeparatedListOfComponentValues, replaceComponentValues, stringify } from '@csstools/css-parser-algorithms';
import { parseContrastColor } from './parse-contrast-color';
import { color, serializeP3, serializeRGB } from '@csstools/css-color-parser';
import { contrast_ratio_wcag_2_1 } from '@csstools/color-helpers';

export enum PREFERS_CONTRAST {
	MORE,
	LESS,
	NO_PREFERENCE,
}

export function transformContrastColor(value: string, prefersContrast: PREFERS_CONTRAST): string {
	const replaced = replaceComponentValues(
		parseCommaSeparatedListOfComponentValues(
			tokenize({ css: value }),
		),
		(componentValue) => {
			const contrastColor = parseContrastColor(componentValue);
			if (!contrastColor) {
				return;
			}

			const [backgroundColor, modifier] = contrastColor;
			if (modifier === 'max') {
				const textColor = color(componentValue);
				if (!textColor) {
					return;
				}

				return serializeRGB(textColor, true);
			}

			if (modifier) {
				// No other modifiers are supported at this time.
				return;
			}

			const maxContrastTextColor = color(new FunctionNode(
				[TokenType.Function, 'contrast-color(', -1, -1, { value: 'contrast-color' }],
				[TokenType.CloseParen, ')', -1, -1, undefined],
				[
					backgroundColor,
					new TokenNode(
						[TokenType.Ident, 'max', -1, -1, { value: 'max' }],
					),
				],
			));
			if (!maxContrastTextColor) {
				return;
			}

			if (prefersContrast === PREFERS_CONTRAST.MORE) {
				return serializeRGB(maxContrastTextColor, true);
			}

			const parsedColor = color(backgroundColor);
			if (!parsedColor) {
				return;
			}

			let l = 0;

			const srgbBackgroundColor = color(serializeRGB(parsedColor, true));
			if (!srgbBackgroundColor) {
				return;
			}

			{
				const blackContrastRatio = contrast_ratio_wcag_2_1(srgbBackgroundColor.channels, [0, 0, 0]);
				const whiteContrastRatio = contrast_ratio_wcag_2_1(srgbBackgroundColor.channels, [1, 1, 1]);

				if (prefersContrast === PREFERS_CONTRAST.LESS) {
					if (blackContrastRatio >= whiteContrastRatio) {
						l = 0.3;
					} else {
						l = 0.9;
					}
				} else {
					if (blackContrastRatio >= whiteContrastRatio) {
						l = 0.2;
					} else {
						l = 0.95;
					}
				}
			}

			const textColor = color(new FunctionNode(
				[TokenType.Function, 'oklch(', -1, -1, { value: 'oklch' }],
				[TokenType.CloseParen, ')', -1, -1, undefined],
				[
					new TokenNode(
						[TokenType.Ident, 'from', -1, -1, { value: 'from' }],
					),
					backgroundColor,
					new TokenNode(
						[TokenType.Number, l.toString(), -1, -1, { value: l, type: NumberType.Number }],
					),
					new TokenNode(
						[TokenType.Ident, 'c', -1, -1, { value: 'c' }],
					),
					new TokenNode(
						[TokenType.Ident, 'h', -1, -1, { value: 'h' }],
					),
				],
			));
			if (!textColor) {
				return;
			}

			const srgbTextColor = color(serializeRGB(textColor, true));
			if (!srgbTextColor) {
				return;
			}

			const contrastRatio = contrast_ratio_wcag_2_1(srgbBackgroundColor.channels, srgbTextColor.channels);
			if (contrastRatio < 4.5) {
				return serializeRGB(maxContrastTextColor, true);
			}

			return serializeP3(textColor, true);
		},
	);

	return stringify(replaced);
}
