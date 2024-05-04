import { ColorData, noneToZeroInRelativeColorDataChannels, normalizeRelativeColorDataChannels } from '../color-data';
import { ComponentValue, FunctionNode } from '@csstools/css-parser-algorithms';
import { TokenNumber, isTokenDelim, isTokenIdent, isTokenNumber, isTokenNumeric } from '@csstools/css-tokenizer';
import { ColorNotation } from '../color-notation';
import { SyntaxFlag } from '../color-data';
import { calcFromComponentValues } from '@csstools/css-calc';
import { isCommentNode, isFunctionNode, isTokenNode, isWhitespaceNode } from '@csstools/css-parser-algorithms';
import { normalizeChannelValuesFn } from './normalize-channel-values';
import { mathFunctionNames } from '@csstools/css-calc';
import { ColorParser } from '../color-parser';
import { colorDataTo } from '../color-data';
import { TokenNode } from '@csstools/css-parser-algorithms';

export function threeChannelSpaceSeparated(
	colorFunctionNode: FunctionNode,
	normalizeChannelValues: normalizeChannelValuesFn,
	colorNotation: ColorNotation,
	syntaxFlags: Array<SyntaxFlag>,
	colorParser: ColorParser,
): ColorData | false {
	const channel1: Array<ComponentValue> = [];
	const channel2: Array<ComponentValue> = [];
	const channel3: Array<ComponentValue> = [];
	const channelAlpha: Array<ComponentValue> = [];
	let relativeToColor: ColorData | false = false;
	let relativeColorChannels: Map<string, TokenNumber> | undefined = undefined;
	let relativeColorChannelsWithoutNone: Map<string, TokenNumber> | undefined = undefined;

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
			// consume as much whitespace as possible
			while (isWhitespaceNode(colorFunctionNode.value[i + 1]) || isCommentNode(colorFunctionNode.value[i + 1])) {
				i++;
			}

			continue;
		}

		if (focus === channel1 && channel1.length) {
			focus = channel2;
		}

		if (focus === channel2 && channel2.length) {
			focus = channel3;
		}

		if (isTokenNode(node) && isTokenDelim(node.value) && node.value[4].value === '/') {
			if (focus === channelAlpha) {
				return false;
			}

			focus = channelAlpha;
			continue;
		}

		if (isFunctionNode(node)) {
			if (focus === channelAlpha && node.getName().toLowerCase() === 'var') {
				colorData.syntaxFlags.add(SyntaxFlag.HasVariableAlpha);
				focus.push(node);
				continue;
			}

			if (!mathFunctionNames.has(node.getName().toLowerCase())) {
				return false;
			}

			const [[result]] = calcFromComponentValues([[node]], {
				censorIntoStandardRepresentableValues: true,
				globals: relativeColorChannelsWithoutNone,
				precision: -1,
				toCanonicalUnits: true,
			});
			if (!result || !isTokenNode(result) || !isTokenNumeric(result.value)) {
				return false;
			}

			if (Number.isNaN(result.value[4].value)) {
				// NaN does not escape a top-level calculation; it’s censored into a zero value
				result.value[4].value = 0;
			}

			node = result;
		}

		if (
			focus === channel1 &&
			channel1.length === 0 &&
			isTokenNode(node) &&
			isTokenIdent(node.value) &&
			node.value[4].value.toLowerCase() === 'from'
		) {
			if (relativeToColor) {
				return false;
			}

			while (isWhitespaceNode(colorFunctionNode.value[i + 1]) || isCommentNode(colorFunctionNode.value[i + 1])) {
				i++;
			}

			i++;
			node = colorFunctionNode.value[i];

			relativeToColor = colorParser(node);
			if (relativeToColor === false) {
				return false;
			}

			if (relativeToColor.syntaxFlags.has(SyntaxFlag.Experimental)) {
				colorData.syntaxFlags.add(SyntaxFlag.Experimental);
			}

			colorData.syntaxFlags.add(SyntaxFlag.RelativeColorSyntax);

			if (relativeToColor.colorNotation !== colorNotation) {
				relativeToColor = colorDataTo(relativeToColor, colorNotation);
			}

			relativeColorChannels = normalizeRelativeColorDataChannels(relativeToColor);
			relativeColorChannelsWithoutNone = noneToZeroInRelativeColorDataChannels(relativeColorChannels);

			continue;
		}

		if (isTokenNode(node)) {
			if (isTokenIdent(node.value) && relativeColorChannels) {
				const channelKeyword = node.value[4].value.toLowerCase();

				if (relativeColorChannels.has(channelKeyword)) {
					// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
					focus.push(new TokenNode(relativeColorChannels.get(channelKeyword)!));
					continue;
				}
			}

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

	if (relativeColorChannels && !relativeColorChannels.has('alpha')) {
		return false;
	}

	const channelValue1 = normalizeChannelValues(channel1[0].value, 0, colorData);
	if (!channelValue1 || !isTokenNumber(channelValue1)) {
		return false;
	}

	const channelValue2 = normalizeChannelValues(channel2[0].value, 1, colorData);
	if (!channelValue2 || !isTokenNumber(channelValue2)) {
		return false;
	}

	const channelValue3 = normalizeChannelValues(channel3[0].value, 2, colorData);
	if (!channelValue3 || !isTokenNumber(channelValue3)) {
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
			if (!channelValueAlpha || !isTokenNumber(channelValueAlpha)) {
				return false;
			}

			channelValues.push(channelValueAlpha);
		} else {
			colorData.alpha = channelAlpha[0];
		}
	} else if (relativeColorChannels && relativeColorChannels.has('alpha')) {
		// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
		const channelValueAlpha = normalizeChannelValues(relativeColorChannels.get('alpha')!, 3, colorData);
		if (!channelValueAlpha || !isTokenNumber(channelValueAlpha)) {
			return false;
		}

		channelValues.push(channelValueAlpha);
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
