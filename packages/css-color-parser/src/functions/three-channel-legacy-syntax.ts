import type { ColorData } from '../color-data';
import type { ComponentValue, FunctionNode } from '@csstools/css-parser-algorithms';
import { TokenNumber, TokenType } from '@csstools/css-tokenizer';
import { ColorNotation } from '../color-notation';
import { SyntaxFlag } from '../color-data';
import { calcFromComponentValues } from '@csstools/css-calc';
import { isCommentNode, isFunctionNode, isTokenNode, isWhitespaceNode } from '@csstools/css-parser-algorithms';
import { normalizeChannelValuesFn } from './normalize-channel-values';
import { toLowerCaseAZ } from '../util/to-lower-case-a-z';
import { mathFunctionNames } from '@csstools/css-calc';

export function threeChannelLegacySyntax(
	colorFunctionNode: FunctionNode,
	normalizeChannelValues: normalizeChannelValuesFn,
	colorNotation: ColorNotation,
	syntaxFlags: Array<SyntaxFlag>,
): ColorData | false {
	const channel1: Array<ComponentValue> = [];
	const channel2: Array<ComponentValue> = [];
	const channel3: Array<ComponentValue> = [];
	const channelAlpha: Array<ComponentValue> = [];

	const colorData: ColorData = {
		colorNotation: colorNotation,
		channels: [0, 0, 0],
		alpha: 1,
		syntaxFlags: new Set(syntaxFlags),
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
				return false;
			}
		}

		if (isFunctionNode(node)) {
			if (focus === channelAlpha && toLowerCaseAZ(node.getName()) === 'var') {
				colorData.syntaxFlags.add(SyntaxFlag.HasVariableAlpha);
				focus.push(node);
				continue;
			}

			if (!mathFunctionNames.has(toLowerCaseAZ(node.getName()))) {
				return false;
			}

			const [[result]] = calcFromComponentValues([[node]], { toCanonicalUnits: true, precision: 100 });
			if (
				!result ||
				!isTokenNode(result) ||
				(
					(
						result.value[0] === TokenType.Percentage ||
						result.value[0] === TokenType.Number ||
						result.value[0] === TokenType.Dimension
					) &&
					Number.isNaN(result.value[4].value)
				)
			) {
				return false;
			}

			node = result;
		}

		if (isTokenNode(node)) {
			focus.push(node);
			continue;
		}

		return false;
	}

	if (focus.length !== 1) {
		return false;
	}

	if (
		channel1.length !== 1 ||
		channel2.length !== 1 ||
		channel3.length !== 1
	) {
		return false;
	}

	if (
		!isTokenNode(channel1[0]) ||
		!isTokenNode(channel2[0]) ||
		!isTokenNode(channel3[0])
	) {
		return false;
	}

	const channelValue1 = normalizeChannelValues(channel1[0].value, 0, colorData);
	if (!channelValue1 || channelValue1[0] !== TokenType.Number) {
		return false;
	}

	const channelValue2 = normalizeChannelValues(channel2[0].value, 1, colorData);
	if (!channelValue2 || channelValue2[0] !== TokenType.Number) {
		return false;
	}

	const channelValue3 = normalizeChannelValues(channel3[0].value, 2, colorData);
	if (!channelValue3 || channelValue3[0] !== TokenType.Number) {
		return false;
	}

	const channelValues: Array<TokenNumber> = [
		channelValue1,
		channelValue2,
		channelValue3,
	];

	if (channelAlpha.length === 1) {
		colorData.syntaxFlags.add(SyntaxFlag.HasAlpha);

		if (isTokenNode(channelAlpha[0])) {
			const channelValueAlpha = normalizeChannelValues(channelAlpha[0].value, 3, colorData);
			if (!channelValueAlpha || channelValueAlpha[0] !== TokenType.Number) {
				return false;
			}

			channelValues.push(channelValueAlpha);
		} else {
			colorData.alpha = channelAlpha[0];
		}
	}

	colorData.channels = [
		channelValues[0][4].value,
		channelValues[1][4].value,
		channelValues[2][4].value,
	];

	if (channelValues.length === 4) {
		colorData.alpha = channelValues[3][4].value;
	}

	return colorData;
}
