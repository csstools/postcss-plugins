import { FunctionNode, isCommentNode, isFunctionNode, isTokenNode, isWhitespaceNode, TokenNode } from '@csstools/css-parser-algorithms';
import { NumberType, TokenNumber, TokenType } from '@csstools/css-tokenizer';
import { calcFromComponentValues } from '@csstools/css-calc';
import { namedColors, xyz } from '@csstools/color-helpers';
import { ColorData, colorDataChannelsToCalcGlobals } from '../color';
import { ColorSpace } from '../color-space';
import { ColorParser } from '../color-parser';
import { threeChannelLegacySyntax } from './three-channel-legacy-syntax';
import { threeChannelSpaceSeparated } from './three-channel-space-separated';
import { normalize_sRGB_ChannelValue } from './normalize-channel-value';

export function rgb(rgbNode: FunctionNode, colorParser: ColorParser): ColorData | -1 {
	{
		const output = rgbCommaSeparated(rgbNode);
		if (output !== -1) {
			return output;
		}
	}

	{
		const output = rgbSpaceSeparated(rgbNode);
		if (output !== -1) {
			return output;
		}
	}

	{
		const output = rgbSpaceSeparated_RCS(rgbNode, colorParser);
		if (output !== -1) {
			return output;
		}
	}

	return -1;
}

function rgbCommaSeparated(rgbNode: FunctionNode): ColorData | -1 {
	return threeChannelLegacySyntax(
		rgbNode,
		normalize_sRGB_ChannelValue,
		ColorSpace.sRGB,
		xyz.sRGB_to_XYZ_D50,
	);
}

function rgbSpaceSeparated(rgbNode: FunctionNode): ColorData | -1 {
	return threeChannelSpaceSeparated(
		rgbNode,
		normalize_sRGB_ChannelValue,
		ColorSpace.sRGB,
		xyz.sRGB_to_XYZ_D50,
	);
}

function rgbSpaceSeparated_RCS(rgbNode: FunctionNode, colorParser: ColorParser): ColorData | -1 {
	let globals: Map<string, TokenNumber> | null = null;
	let alpha = 1;
	const r: Array<TokenNumber> = [];
	const g: Array<TokenNumber> = [];
	const b: Array<TokenNumber> = [];
	const a: Array<TokenNumber> = [];

	let focus = r;
	for (let i = 0; i < rgbNode.value.length; i++) {
		let node = rgbNode.value[i];
		if (isWhitespaceNode(node) || isCommentNode(node)) {
			// consume as much whitespace as possible
			while (isWhitespaceNode(rgbNode.value[i + 1]) || isCommentNode(rgbNode.value[i + 1])) {
				i++;
			}

			if (!r.length) {
				continue;
			}

			if (focus === r) {
				focus = g;
				continue;
			}

			if (focus === g) {
				focus = b;
				continue;
			}

			continue;
		}

		if (
			isTokenNode(node) &&
			!globals &&
			node.value[0] === TokenType.Ident &&
			node.value[4].value.toLowerCase() === 'from'
		) {
			// consume as much whitespace as possible
			while (isWhitespaceNode(rgbNode.value[i + 1]) || isCommentNode(rgbNode.value[i + 1])) {
				i++;
			}

			const nextNode = rgbNode.value[i + 1];
			if (isTokenNode(nextNode) && nextNode.value[0] === TokenType.Ident) {
				const colorName = nextNode.value[4].value.toLowerCase();
				if (colorName === 'currentcolor') {
					return -1;
				}

				if (colorName === 'transparent') {
					globals = colorDataChannelsToCalcGlobals({
						channels: [0, 0, 0],
						alpha: 0,
						currentColorSpace: ColorSpace.sRGB,
						sourceColorSpace: ColorSpace.sRGB,
					});
					alpha = 0;

					i++;
					continue;
				}

				if (!Object.prototype.hasOwnProperty.call(namedColors, colorName)) {
					return -1;
				}

				const namedColor = namedColors[colorName];
				if (!namedColor) {
					return -1;
				}

				globals = colorDataChannelsToCalcGlobals({
					channels: [
						namedColor[0] / 255,
						namedColor[1] / 255,
						namedColor[2] / 255,
					],
					alpha: 1,
					currentColorSpace: ColorSpace.sRGB,
					sourceColorSpace: ColorSpace.sRGB,
				});
				alpha = 1;

				i++;
				continue;
			}

			if (isFunctionNode(nextNode)) {
				if (nextNode.getName().toLowerCase() === 'var') {
					return -1;
				}

				const fromColor = colorParser(nextNode);
				if (fromColor === -1) {
					return -1;
				}

				globals = colorDataChannelsToCalcGlobals({
					channels: xyz.XYZ_D50_to_sRGB(fromColor.channels),
					alpha: fromColor.alpha,
					currentColorSpace: ColorSpace.sRGB,
					sourceColorSpace: fromColor.sourceColorSpace,
				});
				alpha = fromColor.alpha;

				i++;
				continue;
			}
		}

		if (!globals) {
			return -1;
		}

		if (isTokenNode(node) && node.value[0] === TokenType.Delim && node.value[4].value === '/') {
			if (focus === a) {
				return -1;
			}

			focus = a;
			continue;
		}

		if (isFunctionNode(node)) {
			if (node.getName().toLowerCase() !== 'calc') {
				return -1;
			}

			const [[result]] = calcFromComponentValues([[node]], { toCanonicalUnits: true, precision: 100, globals: globals });
			if (!result || !isTokenNode(result)) {
				return -1;
			}

			node = result;
		}

		if (isTokenNode(node)) {
			if (node.value[0] === TokenType.Ident) {
				const token = node.value;
				const value = globals.get(token[4].value.toLowerCase());
				if (!value) {
					return -1;
				}

				node = new TokenNode(value);
			}

			if (node.value[0] === TokenType.Percentage) {
				const token = node.value;

				focus.push([
					TokenType.Number,
					(token[4].value / 100).toString(),
					token[2],
					token[3],
					{
						value: token[4].value / 100,
						type: NumberType.Number,
					},
				]);
				continue;
			}

			if (node.value[0] === TokenType.Number) {
				let scale = 255;
				if (focus === a) {
					scale = 1;
				}

				const token = node.value;

				focus.push([
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
		}

		return -1;
	}

	if (focus.length !== 1) {
		return -1;
	}

	if (
		r.length !== 1 ||
		g.length !== 1 ||
		b.length !== 1
	) {
		return -1;
	}

	return {
		channels: xyz.sRGB_to_XYZ_D50([
			r[0][4].value,
			g[0][4].value,
			b[0][4].value,
		]),
		alpha: a.length === 1 ? a[0][4].value : alpha,
		currentColorSpace: ColorSpace.XYZ_D50,
		sourceColorSpace: ColorSpace.sRGB,
	};
}
