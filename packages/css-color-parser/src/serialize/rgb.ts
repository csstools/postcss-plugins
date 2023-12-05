import { ColorData, convertPowerlessComponentsToZeroValuesForDisplay } from '../color-data';
import type { TokenCloseParen, TokenComma, TokenWhitespace } from '@csstools/css-tokenizer';
import { FunctionNode, TokenNode, WhitespaceNode } from '@csstools/css-parser-algorithms';
import { NumberType, TokenType } from '@csstools/css-tokenizer';
import { XYZ_D50_to_sRGB } from '@csstools/color-helpers';
import { colorData_to_XYZ_D50 } from '../color-data';
import { toPrecision } from './to-precision';
import { XYZ_D50_to_sRGB_Gamut } from '../gamut-mapping/srgb';

/**
 * Convert color data to component values in the srgb color space.
 * The return value can be converted to a string by calling `toString()` on it.
 *
 * @param {ColorData} color - The color data to be serialized.
 * @param {boolean} gamutMapping - Whether to perform gamut mapping, defaults to `true`.
 * @returns {FunctionNode} The serialized color data as a FunctionNode object.
 */
export function serializeRGB(color: ColorData, gamutMapping = true): FunctionNode {
	color.channels = convertPowerlessComponentsToZeroValuesForDisplay(color.channels, color.colorNotation);
	let srgb = color.channels.map((x) => Number.isNaN(x) ? 0 : x);

	if (gamutMapping) {
		srgb = XYZ_D50_to_sRGB_Gamut(colorData_to_XYZ_D50(color).channels);
	} else {
		srgb = XYZ_D50_to_sRGB(colorData_to_XYZ_D50(color).channels);
	}

	const r = Math.min(255, Math.max(0, Math.round(toPrecision(srgb[0]) * 255)));
	const g = Math.min(255, Math.max(0, Math.round(toPrecision(srgb[1]) * 255)));
	const b = Math.min(255, Math.max(0, Math.round(toPrecision(srgb[2]) * 255)));

	const close: TokenCloseParen = [TokenType.CloseParen, ')', -1, -1, undefined];
	const space: TokenWhitespace = [TokenType.Whitespace, ' ', -1, -1, undefined];
	const comma: TokenComma = [TokenType.Comma, ',', -1, -1, undefined];

	const channels = [
		new TokenNode([TokenType.Number, r.toString(), -1, -1, { value: srgb[0], type: NumberType.Integer }]),
		new TokenNode(comma),
		new WhitespaceNode([space]),
		new TokenNode([TokenType.Number, g.toString(), -1, -1, { value: srgb[1], type: NumberType.Integer }]),
		new TokenNode(comma),
		new WhitespaceNode([space]),
		new TokenNode([TokenType.Number, b.toString(), -1, -1, { value: srgb[2], type: NumberType.Integer }]),
	];

	if (typeof color.alpha === 'number') {
		const a = Math.min(1, Math.max(0, toPrecision(Number.isNaN(color.alpha) ? 0 : color.alpha)));
		if (toPrecision(a, 4) === 1) {
			return new FunctionNode(
				[TokenType.Function, 'rgb(', -1, -1, { value: 'rgb' }],
				close,
				channels,
			);
		}

		return new FunctionNode(
			[TokenType.Function, 'rgba(', -1, -1, { value: 'rgba' }],
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
		[TokenType.Function, 'rgba(', -1, -1, { value: 'rgba' }],
		close,
		[
			...channels,
			new TokenNode(comma),
			new WhitespaceNode([space]),
			color.alpha,
		],
	);
}
