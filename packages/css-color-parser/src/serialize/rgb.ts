import type { TokenCloseParen }from '@csstools/css-tokenizer';
import { ColorData, colorData_to_XYZ_D50 } from '../color-data';
import { ColorNotation } from '../color-notation';
import { FunctionNode, TokenNode } from '@csstools/css-parser-algorithms';
import { NumberType, TokenType } from '@csstools/css-tokenizer';
import { calculations, Color, conversions, utils, xyz } from '@csstools/color-helpers';
import { toPrecision } from './to-precision';

export function serializeRGB(color: ColorData): FunctionNode {
	let srgb = color.channels.map((x) => Number.isNaN(x) ? 0 : x);
	if (
		color.colorNotation !== ColorNotation.RGB &&
		color.colorNotation !== ColorNotation.HEX
	) {
		srgb = XYZ_D50_to_sRGB_Gamut(colorData_to_XYZ_D50(color).channels);
	}

	const r = Math.min(255, Math.max(0, Math.round(toPrecision(srgb[0]) * 255)));
	const g = Math.min(255, Math.max(0, Math.round(toPrecision(srgb[1]) * 255)));
	const b = Math.min(255, Math.max(0, Math.round(toPrecision(srgb[2]) * 255)));

	const close: TokenCloseParen = [TokenType.CloseParen, ')', -1, -1, undefined];

	const channels = [
		new TokenNode([TokenType.Number, r.toString(), -1, -1, { value: srgb[0], type: NumberType.Integer }]),
		new TokenNode([TokenType.Comma, ',', -1, -1, undefined]),
		new TokenNode([TokenType.Whitespace, ' ', -1, -1, undefined]),
		new TokenNode([TokenType.Number, g.toString(), -1, -1, { value: srgb[1], type: NumberType.Integer }]),
		new TokenNode([TokenType.Comma, ',', -1, -1, undefined]),
		new TokenNode([TokenType.Whitespace, ' ', -1, -1, undefined]),
		new TokenNode([TokenType.Number, b.toString(), -1, -1, { value: srgb[2], type: NumberType.Integer }]),
	];

	if (typeof color.alpha === 'number') {
		const a = Math.min(1, Math.max(0, toPrecision(Number.isNaN(color.alpha) ? 0 : color.alpha)));
		if (a === 1) {
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
				new TokenNode([TokenType.Comma, ',', -1, -1, undefined]),
				new TokenNode([TokenType.Whitespace, ' ', -1, -1, undefined]),
				new TokenNode([TokenType.Number, a.toString(), -1, -1, { value: color.alpha, type: NumberType.Integer }]),
			],
		);
	}

	return new FunctionNode(
		[TokenType.Function, 'rgba(', -1, -1, { value: 'rgba' }],
		close,
		[
			...channels,
			new TokenNode([TokenType.Comma, ',', -1, -1, undefined]),
			new TokenNode([TokenType.Whitespace, ' ', -1, -1, undefined]),
			color.alpha,
		],
	);
}

export function XYZ_D50_to_sRGB_Gamut(color: Color): Color {
	const srgb = xyz.XYZ_D50_to_sRGB(color);
	if (utils.inGamut(srgb)) {
		return utils.clip(srgb);
	}

	let oklch = color.slice() as Color;
	oklch = conversions.D50_to_D65(oklch);
	oklch = conversions.XYZ_to_OKLab(oklch);
	oklch = conversions.OKLab_to_OKLCH(oklch);
	if (oklch[0] < 0.000001) {
		oklch = [0, 0, 0] as Color;
	}

	if (oklch[0] > 0.999999) {
		oklch = [1, 0, 0] as Color;
	}

	return calculations.mapGamut(oklch, (x: Color) => {
		x = conversions.OKLCH_to_OKLab(x);
		x = conversions.OKLab_to_XYZ(x);
		x = conversions.XYZ_to_lin_sRGB(x);
		return conversions.gam_sRGB(x);
	}, (x: Color) => {
		x = conversions.lin_sRGB(x);
		x = conversions.lin_sRGB_to_XYZ(x);
		x = conversions.XYZ_to_OKLab(x);
		return conversions.OKLab_to_OKLCH(x);
	});
}
