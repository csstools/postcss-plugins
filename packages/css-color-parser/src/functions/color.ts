import type { ColorData } from '../color-data';
import type { ColorParser } from '../color-parser';
import { FunctionNode, isCommentNode, isTokenNode, isWhitespaceNode } from '@csstools/css-parser-algorithms';
import { ColorNotation } from '../color-notation';
import { threeChannelSpaceSeparated } from './three-channel-space-separated';
import { toLowerCaseAZ } from '../util/to-lower-case-a-z';
import { TokenType } from '@csstools/css-tokenizer';
import { normalize_Color_ChannelValues } from './color-normalize-channel-values';

const colorSpaces = new Set(['srgb', 'srgb-linear', 'display-p3', 'a98-rgb', 'prophoto-rgb', 'rec2020', 'xyz', 'xyz-d50', 'xyz-d65']);

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function color(colorNode: FunctionNode, colorParser: ColorParser): ColorData | false {
	for (let i = 0; i < colorNode.value.length; i++) {
		const node = colorNode.value[i];
		if (isWhitespaceNode(node) || isCommentNode(node)) {
			continue;
		}

		if (
			isTokenNode(node) &&
			node.value[0] === TokenType.Ident
		) {
			const colorSpace = toLowerCaseAZ(node.value[4].value);
			if (!colorSpaces.has(colorSpace)) {
				return false;
			}

			return threeChannelSpaceSeparated(
				new FunctionNode(
					colorNode.name,
					colorNode.endToken,
					colorNode.value.slice(i + 1),
				),
				normalize_Color_ChannelValues,
				colorSpaceNameToColorNotation(colorSpace),
				[],
			);
		}

		return false;
	}

	return false;
}

function colorSpaceNameToColorNotation(colorSpace: string): ColorNotation {
	switch (colorSpace) {
		case 'srgb':
			return ColorNotation.RGB;
		case 'srgb-linear':
			return ColorNotation.Linear_RGB;
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
