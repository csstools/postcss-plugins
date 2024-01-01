import { ColorData, convertPowerlessComponentsToZeroValuesForDisplay } from '../color-data';
import type { TokenCloseParen, TokenComma, TokenWhitespace } from '@csstools/css-tokenizer';
import { FunctionNode, TokenNode, WhitespaceNode } from '@csstools/css-parser-algorithms';
import { NumberType, TokenType } from '@csstools/css-tokenizer';
import { XYZ_D50_to_HSL, sRGB_to_XYZ_D50 } from '@csstools/color-helpers';
import { colorData_to_XYZ_D50 } from '../color-data';
import { toPrecision } from './to-precision';
import { XYZ_D50_to_sRGB_Gamut } from '../gamut-mapping/srgb';

export function serializeHSL(color: ColorData, gamutMapping = true): FunctionNode {
	color.channels = convertPowerlessComponentsToZeroValuesForDisplay(color.channels, color.colorNotation);
	let hsl = color.channels.map((x) => Number.isNaN(x) ? 0 : x);

	if (gamutMapping) {
		hsl = XYZ_D50_to_HSL(sRGB_to_XYZ_D50(
			XYZ_D50_to_sRGB_Gamut(colorData_to_XYZ_D50(color).channels),
		));
	} else {
		hsl = XYZ_D50_to_HSL(colorData_to_XYZ_D50(color).channels);
	}

	// Needs to be done twice because `xyz.XYZ_D50_to_HSL` can return `NaN` values.
	hsl = hsl.map((x) => Number.isNaN(x) ? 0 : x);

	const h = Math.min(360, Math.max(0, Math.round(toPrecision(hsl[0]))));
	const s = Math.min(100, Math.max(0, Math.round(toPrecision(hsl[1]))));
	const l = Math.min(100, Math.max(0, Math.round(toPrecision(hsl[2]))));

	const close: TokenCloseParen = [TokenType.CloseParen, ')', -1, -1, undefined];
	const space: TokenWhitespace = [TokenType.Whitespace, ' ', -1, -1, undefined];
	const comma: TokenComma = [TokenType.Comma, ',', -1, -1, undefined];

	const channels = [
		new TokenNode([TokenType.Number, h.toString(), -1, -1, { value: hsl[0], type: NumberType.Integer }]),
		new TokenNode(comma),
		new WhitespaceNode([space]),
		new TokenNode([TokenType.Percentage, s.toString() + '%', -1, -1, { value: hsl[1] }]),
		new TokenNode(comma),
		new WhitespaceNode([space]),
		new TokenNode([TokenType.Percentage, l.toString() + '%', -1, -1, { value: hsl[2] }]),
	];

	if (typeof color.alpha === 'number') {
		const a = Math.min(1, Math.max(0, toPrecision(Number.isNaN(color.alpha) ? 0 : color.alpha)));
		if (toPrecision(a, 4) === 1) {
			return new FunctionNode(
				[TokenType.Function, 'hsl(', -1, -1, { value: 'hsl' }],
				close,
				channels,
			);
		}

		return new FunctionNode(
			[TokenType.Function, 'hsla(', -1, -1, { value: 'hsla' }],
			close,
			[
				...channels,
				new TokenNode(comma),
				new WhitespaceNode([space]),
				new TokenNode([TokenType.Number, toPrecision(a, 4).toString(), -1, -1, { value: color.alpha, type: NumberType.Number }]),
			],
		);
	}

	return new FunctionNode(
		[TokenType.Function, 'hsla(', -1, -1, { value: 'hsla' }],
		close,
		[
			...channels,
			new TokenNode(comma),
			new WhitespaceNode([space]),
			color.alpha,
		],
	);
}
