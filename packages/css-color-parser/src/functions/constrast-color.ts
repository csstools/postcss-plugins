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

	const contrastWhite = contrastRatio(backgroundColorData.channels, [1, 1, 1]);
	const contrastBlack = contrastRatio(backgroundColorData.channels, [0, 0, 0]);

	if (contrastWhite > contrastBlack) {
		colorData.channels = [1, 1, 1];
	} else {
		colorData.channels = [0, 0, 0];
	}

	return colorData;
}

function luminance(color: Color): number {
	// https://www.w3.org/TR/WCAG21/#dfn-relative-luminance
	const [lumR, lumG, lumB] = color.map(component => {
		return component <= 0.03928
			? component / 12.92
			: Math.pow((component + 0.055) / 1.055, 2.4);
	});

	return 0.2126 * lumR + 0.7152 * lumG + 0.0722 * lumB;
}

function contrastRatio(color1: Color, color2: Color): number {
	// https://www.w3.org/TR/WCAG21/#dfn-contrast-ratio
	const color1luminance = luminance(color1);
	const color2luminance = luminance(color2);

	const l1 = Math.max(color1luminance, color2luminance);
	const l2 = Math.min(color1luminance, color2luminance);

	return (l1 + 0.05) / (l2 + 0.05);
}
