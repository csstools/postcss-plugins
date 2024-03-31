import type { ColorData } from '../color-data';
import type { ColorParser } from '../color-parser';
import type { FunctionNode } from '@csstools/css-parser-algorithms';
import { ColorNotation } from '../color-notation';
import { SyntaxFlag, colorData_to_XYZ_D50 } from '../color-data';
import { isCommentNode, isTokenNode, isWhitespaceNode } from '@csstools/css-parser-algorithms';
import { Color } from '@csstools/color-helpers';
import { XYZ_D50_to_sRGB_Gamut } from '../gamut-mapping/srgb';
import { TokenType } from '@csstools/css-tokenizer';
import { toLowerCaseAZ } from '../util/to-lower-case-a-z';
import { contrast_ratio_wcag_2_1 } from '@csstools/color-helpers';

export function contrastColor(colorMixNode: FunctionNode, colorParser: ColorParser): ColorData | false {
	let backgroundColorData: ColorData | false = false;
	let maxKeyword: boolean = false;

	for (let i = 0; i < colorMixNode.value.length; i++) {
		const node = colorMixNode.value[i];
		if (isWhitespaceNode(node) || isCommentNode(node)) {
			continue;
		}

		if (!backgroundColorData) {
			backgroundColorData = colorParser(node);
			if (backgroundColorData) {
				continue;
			}
		}

		if (backgroundColorData && !maxKeyword) {
			if (
				isTokenNode(node) &&
				node.value[0] === TokenType.Ident &&
				toLowerCaseAZ(node.value[4].value) === 'max'
			) {
				maxKeyword = true;
				continue;
			}
		}

		return false;
	}

	if (!backgroundColorData || !maxKeyword) {
		return false;
	}

	// Treat missing as zero.
	backgroundColorData.channels = backgroundColorData.channels.map((x) => Number.isNaN(x) ? 0 : x) as Color;
	backgroundColorData.channels = XYZ_D50_to_sRGB_Gamut(colorData_to_XYZ_D50(backgroundColorData).channels);
	backgroundColorData.colorNotation = ColorNotation.sRGB;

	const colorData: ColorData = {
		colorNotation: ColorNotation.sRGB,
		channels: [0, 0, 0],
		alpha: 1,
		syntaxFlags: new Set([SyntaxFlag.ContrastColor, SyntaxFlag.Experimental]),
	};

	const contrastWhite = contrast_ratio_wcag_2_1(backgroundColorData.channels, [1, 1, 1]);
	const contrastBlack = contrast_ratio_wcag_2_1(backgroundColorData.channels, [0, 0, 0]);

	if (contrastWhite > contrastBlack) {
		colorData.channels = [1, 1, 1];
	} else {
		colorData.channels = [0, 0, 0];
	}

	return colorData;
}
