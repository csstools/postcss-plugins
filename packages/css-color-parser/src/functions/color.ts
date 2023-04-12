import { ColorData, SyntaxFlag, colorDataTo, noneToZeroInRelativeColorDataChannels, normalizeRelativeColorDataChannels } from '../color-data';
import type { ColorParser } from '../color-parser';
import { ColorNotation } from '../color-notation';
import { ComponentValue, FunctionNode, TokenNode, isCommentNode, isFunctionNode, isTokenNode, isWhitespaceNode } from '@csstools/css-parser-algorithms';
import { CSSToken, TokenDimension, TokenNumber, TokenPercentage, TokenType } from '@csstools/css-tokenizer';
import { normalize_Color_ChannelValues } from './color-normalize-channel-values';
import { toLowerCaseAZ } from '../util/to-lower-case-a-z';
import { calcFromComponentValues, mathFunctionNames } from '@csstools/css-calc';

const colorSpaces = new Set(['srgb', 'srgb-linear', 'display-p3', 'a98-rgb', 'prophoto-rgb', 'rec2020', 'xyz', 'xyz-d50', 'xyz-d65']);

export function color(colorFunctionNode: FunctionNode, colorParser: ColorParser): ColorData | false {
	const syntaxFlags: Array<SyntaxFlag> = [];

	const channel1: Array<ComponentValue> = [];
	const channel2: Array<ComponentValue> = [];
	const channel3: Array<ComponentValue> = [];
	const channelAlpha: Array<ComponentValue> = [];

	let colorSpace: string | false = false;
	let relativeToColor: ColorData | false = false;
	let relativeColorChannels: Map<string, TokenNumber | TokenPercentage | TokenDimension> | undefined = undefined;
	let relativeColorChannelsWithoutNone: Map<string, TokenNumber | TokenPercentage | TokenDimension> | undefined = undefined;

	const colorData: ColorData = {
		colorNotation: ColorNotation.sRGB,
		channels: [0, 0, 0],
		alpha: 1,
		syntaxFlags: (new Set(syntaxFlags)),
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

		if (isTokenNode(node) && node.value[0] === TokenType.Delim && node.value[4].value === '/') {
			if (focus === channelAlpha) {
				return false;
			}

			focus = channelAlpha;
			continue;
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

			const [[result]] = calcFromComponentValues([[node]], { toCanonicalUnits: true, precision: 100, globals: relativeColorChannelsWithoutNone });
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

		if (
			focus === channel1 &&
			channel1.length === 0 &&
			isTokenNode(node) &&
			node.value[0] === TokenType.Ident &&
			colorSpaces.has(toLowerCaseAZ(node.value[4].value))
		) {
			if (colorSpace) {
				return false;
			}

			syntaxFlags.push(SyntaxFlag.RelativeColorSyntax);

			colorSpace = toLowerCaseAZ(node.value[4].value);
			colorData.colorNotation = colorSpaceNameToColorNotation(colorSpace);

			if (relativeToColor) {
				if (relativeToColor.colorNotation !== colorData.colorNotation) {
					relativeToColor = colorDataTo(relativeToColor, colorData.colorNotation);
				}

				relativeColorChannels = normalizeRelativeColorDataChannels(relativeToColor);
				relativeColorChannelsWithoutNone = noneToZeroInRelativeColorDataChannels(relativeColorChannels);
			}

			continue;
		}

		if (
			focus === channel1 &&
			channel1.length === 0 &&
			isTokenNode(node) &&
			node.value[0] === TokenType.Ident &&
			toLowerCaseAZ(node.value[4].value) === 'from'
		) {
			if (relativeToColor) {
				return false;
			}

			if (colorSpace) {
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

			continue;
		}

		if (isTokenNode(node)) {
			if (node.value[0] === TokenType.Ident && relativeColorChannels && relativeColorChannels.has(toLowerCaseAZ(node.value[4].value))) {
				// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
				focus.push(new TokenNode(relativeColorChannels.get(toLowerCaseAZ(node.value[4].value))!));
				continue;
			}

			focus.push(node);
			continue;
		}

		return false;
	}

	if (!colorSpace) {
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

	const channelValues: Array<CSSToken> = [
		channel1[0].value,
		channel2[0].value,
		channel3[0].value,
	];

	if (channelAlpha.length === 1) {
		colorData.syntaxFlags.add(SyntaxFlag.HasAlpha);

		if (isTokenNode(channelAlpha[0])) {
			channelValues.push(channelAlpha[0].value);
		} else {
			colorData.alpha = channelAlpha[0];
		}
	} else if (relativeColorChannels && relativeColorChannels.has('alpha')) {
		// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
		channelValues.push(relativeColorChannels.get('alpha')!);
	}

	const normalizedChannelValues = normalize_Color_ChannelValues(channelValues, colorData);
	if (normalizedChannelValues === false) {
		return false;
	}

	colorData.channels = [
		normalizedChannelValues[0][4].value,
		normalizedChannelValues[1][4].value,
		normalizedChannelValues[2][4].value,
	];

	if (normalizedChannelValues.length === 4) {
		colorData.alpha = normalizedChannelValues[3][4].value;
	}

	return colorData;
}


function colorSpaceNameToColorNotation(colorSpace: string): ColorNotation {
	switch (colorSpace) {
		case 'srgb':
			return ColorNotation.sRGB;
		case 'srgb-linear':
			return ColorNotation.Linear_sRGB;
		case 'display-p3':
			return ColorNotation.Display_P3;
		case 'a98-rgb':
			return ColorNotation.A98_RGB;
		case 'prophoto-rgb':
			return ColorNotation.ProPhoto_RGB;
		case 'rec2020':
			return ColorNotation.Rec2020;
		case 'xyz':
			return ColorNotation.XYZ_D65;
		case 'xyz-d50':
			return ColorNotation.XYZ_D50;
		case 'xyz-d65':
			return ColorNotation.XYZ_D65;
		default:
			throw new Error('Unknown color space name: ' + colorSpace);
	}
}
