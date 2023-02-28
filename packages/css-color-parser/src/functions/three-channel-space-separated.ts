import type { Color } from '@csstools/color-helpers';
import type { ColorData } from '../color';
import { ColorSpace } from '../color-space';
import { FunctionNode, isCommentNode, isFunctionNode, isTokenNode, isWhitespaceNode } from '@csstools/css-parser-algorithms';
import { TokenNumber, TokenType } from '@csstools/css-tokenizer';
import { calcFromComponentValues } from '@csstools/css-calc';
import { normalizeChannelValueFn } from './normalize-channel-value';

export function threeChannelSpaceSeparated(
	colorFunctionNode: FunctionNode,
	normalizeChannelValue: normalizeChannelValueFn,
	sourceColorSpace: ColorSpace,
	sourceColorTo_XYZ: (color: Color) => Color,
): ColorData | -1 {
	const channel1: Array<TokenNumber> = [];
	const channel2: Array<TokenNumber> = [];
	const channel3: Array<TokenNumber> = [];
	const channelAlpha: Array<TokenNumber> = [];

	let focus = channel1;
	for (let i = 0; i < colorFunctionNode.value.length; i++) {
		let node = colorFunctionNode.value[i];
		if (isWhitespaceNode(node) || isCommentNode(node)) {
			// consume as much whitespace as possible
			while (isWhitespaceNode(colorFunctionNode.value[i + 1]) || isCommentNode(colorFunctionNode.value[i + 1])) {
				i++;
			}

			if (!channel1.length) {
				continue;
			}

			if (focus === channel1) {
				focus = channel2;
				continue;
			}

			if (focus === channel2) {
				focus = channel3;
				continue;
			}

			continue;
		}

		if (isTokenNode(node) && node.value[0] === TokenType.Delim && node.value[4].value === '/') {
			if (focus === channelAlpha) {
				return -1;
			}

			focus = channelAlpha;
			continue;
		}

		if (isFunctionNode(node)) {
			if (node.getName().toLowerCase() !== 'calc') {
				return -1;
			}

			const [[result]] = calcFromComponentValues([[node]], { toCanonicalUnits: true, precision: 100 });
			if (!result || !isTokenNode(result)) {
				return -1;
			}

			node = result;
		}

		if (isTokenNode(node)) {
			let index = 0;
			if (focus === channel1) {
				index = 0;
			} else if (focus === channel2) {
				index = 1;
			} else if (focus === channel3) {
				index = 2;
			} else if (focus === channelAlpha) {
				index = 3;
			} else {
				return -1;
			}

			const normalized = normalizeChannelValue(node.value, index);
			if (normalized === -1) {
				return -1;
			}

			focus.push(normalized);
			continue;
		}

		return -1;
	}

	if (focus.length !== 1) {
		return -1;
	}

	if (
		channel1.length !== 1 ||
		channel2.length !== 1 ||
		channel3.length !== 1
	) {
		return -1;
	}

	return {
		channels: sourceColorTo_XYZ([
			channel1[0][4].value,
			channel2[0][4].value,
			channel3[0][4].value,
		]),
		alpha: channelAlpha.length === 1 ? channelAlpha[0][4].value : 1,
		currentColorSpace: ColorSpace.XYZ_D50,
		sourceColorSpace: sourceColorSpace,
	};
}
