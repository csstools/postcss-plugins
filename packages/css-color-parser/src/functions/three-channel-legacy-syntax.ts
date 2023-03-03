import type { Color } from '@csstools/color-helpers';
import type { ColorData } from '../color-data';
import { SyntaxFlag } from '../color-data';
import { ColorSpace } from '../color-space';
import { FunctionNode, isCommentNode, isFunctionNode, isTokenNode, isWhitespaceNode } from '@csstools/css-parser-algorithms';
import { CSSToken, TokenType } from '@csstools/css-tokenizer';
import { calcFromComponentValues } from '@csstools/css-calc';
import { normalizeChannelValuesFn } from './normalize-channel-values';
import { toLowerCaseAZ } from '../util/to-lower-case-a-z';

export function threeChannelLegacySyntax(
	colorFunctionNode: FunctionNode,
	normalizeChannelValues: normalizeChannelValuesFn,
	sourceColorSpace: ColorSpace,
	sourceColorTo_XYZ: (color: Color) => Color,
	syntaxFlags: Array<SyntaxFlag>,
): ColorData | -1 {
	const channel1: Array<CSSToken> = [];
	const channel2: Array<CSSToken> = [];
	const channel3: Array<CSSToken> = [];
	const channelAlpha: Array<CSSToken> = [];

	const colorData: ColorData = {
		colorSpace: ColorSpace.XYZ_D50,
		channels: [0, 0, 0],

		sourceColorSpace: sourceColorSpace,
		alpha: 0,
		missingComponents: [false, false, false, false],
		syntaxFlags: (new Set(syntaxFlags)),
	};

	let focus = channel1;
	for (let i = 0; i < colorFunctionNode.value.length; i++) {
		let node = colorFunctionNode.value[i];
		if (isWhitespaceNode(node) || isCommentNode(node)) {
			continue;
		}

		if (isTokenNode(node) && node.value[0] === TokenType.Comma) {
			if (focus === channel1) {
				focus = channel2;
				continue;
			}

			if (focus === channel2) {
				focus = channel3;
				continue;
			}

			if (focus === channel3) {
				focus = channelAlpha;
				continue;
			}

			if (focus === channelAlpha) {
				return -1;
			}
		}

		if (isFunctionNode(node)) {
			if (toLowerCaseAZ(node.getName()) !== 'calc') {
				return -1;
			}

			const [[result]] = calcFromComponentValues([[node]], { toCanonicalUnits: true, precision: 100 });
			if (!result || !isTokenNode(result)) {
				return -1;
			}

			node = result;
		}

		if (isTokenNode(node)) {
			focus.push(node.value);
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

	const channelValues: Array<CSSToken> = [
		channel1[0],
		channel2[0],
		channel3[0],
	];

	const hasAlpha = channelAlpha.length === 1;
	if (hasAlpha) {
		colorData.syntaxFlags.add(SyntaxFlag.HasAlpha);
		channelValues.push(channelAlpha[0]);
	}

	const normalizedChannelValues = normalizeChannelValues(channelValues, colorData);
	if (normalizedChannelValues === -1) {
		return -1;
	}

	colorData.channels = sourceColorTo_XYZ([
		normalizedChannelValues[0][4].value,
		normalizedChannelValues[1][4].value,
		normalizedChannelValues[2][4].value,
	]);
	colorData.alpha = hasAlpha ? normalizedChannelValues[3][4].value : 1;

	return colorData;
}
