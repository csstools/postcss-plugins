import type { ColorData } from '../color-data';
import type { ColorParser } from '../color-parser';
import type { FunctionNode } from '@csstools/css-parser-algorithms';
import { ColorNotation } from '../color-notation';
import { SyntaxFlag, colorDataTo, colorData_to_XYZ_D50 } from '../color-data';
import { isCommentNode, isWhitespaceNode } from '@csstools/css-parser-algorithms';
import { apca_adobeRGBtoY, apca_contrast, apca_displayP3toY, apca_sRGBtoY } from '../util/apca';
import { Color } from '@csstools/color-helpers';
import { XYZ_D50_to_P3_Gamut } from '../gamut-mapping/p3';
import { XYZ_D50_to_a98_Gamut } from '../gamut-mapping/a98';
import { XYZ_D50_to_sRGB_Gamut } from '../gamut-mapping/srgb';

export function contrastColor(colorMixNode: FunctionNode, colorParser: ColorParser): ColorData | false {
	let backgroundColor: ColorData | false = false;

	for (let i = 0; i < colorMixNode.value.length; i++) {
		const node = colorMixNode.value[i];
		if (isWhitespaceNode(node) || isCommentNode(node)) {
			continue;
		}

		if (backgroundColor) {
			return false;
		}

		const parsedColor = colorParser(node);
		if (parsedColor) {
			backgroundColor = parsedColor;
			continue;
		}

		return false;
	}

	if (!backgroundColor) {
		return false;
	}

	// 1. Convert to OKLCH
	// 2. Resolve all missing and powerless components to zero
	// 3. Above 0.72 L (lightness) use black, below use white

	// Convert to APCA supported color spaces
	switch (backgroundColor.colorNotation) {
		case ColorNotation.HEX:
		case ColorNotation.RGB:
		case ColorNotation.sRGB:
			backgroundColor = colorDataTo(backgroundColor, ColorNotation.sRGB);
			break;
		case ColorNotation.Display_P3:
			backgroundColor = colorDataTo(backgroundColor, ColorNotation.Display_P3);
			break;
		case ColorNotation.A98_RGB:
			backgroundColor = colorDataTo(backgroundColor, ColorNotation.A98_RGB);
			break;
		case ColorNotation.HSL:
			backgroundColor = colorDataTo(backgroundColor, ColorNotation.sRGB);
			break;
		default:
			backgroundColor = colorDataTo(backgroundColor, ColorNotation.A98_RGB);
			break;
	}

	// Treat missing as zero.
	backgroundColor.channels = backgroundColor.channels.map((x) => Number.isNaN(x) ? 0 : x) as Color;

	// Calculate contrast color
	switch (backgroundColor.colorNotation) {
		case ColorNotation.HEX:
		case ColorNotation.RGB:
		case ColorNotation.sRGB: {
			const backgroundY = apca_sRGBtoY(XYZ_D50_to_sRGB_Gamut(colorData_to_XYZ_D50(backgroundColor).channels));

			const whiteContrast = Math.abs(apca_contrast(1, backgroundY));
			const blackContrast = Math.abs(apca_contrast(0, backgroundY));

			const colorData: ColorData = {
				colorNotation: ColorNotation.sRGB,
				channels: [0, 0, 0],
				alpha: 1,
				syntaxFlags: new Set([SyntaxFlag.ContrastColor, SyntaxFlag.Experimental]),
			};

			if (whiteContrast > blackContrast) {
				colorData.channels = [1, 1, 1];
			}

			return colorData;
		}
		case ColorNotation.Display_P3: {
			const backgroundY = apca_displayP3toY(XYZ_D50_to_P3_Gamut(colorData_to_XYZ_D50(backgroundColor).channels));

			const whiteContrast = Math.abs(apca_contrast(1, backgroundY));
			const blackContrast = Math.abs(apca_contrast(0, backgroundY));

			const colorData: ColorData = {
				colorNotation: ColorNotation.Display_P3,
				channels: [0, 0, 0],
				alpha: 1,
				syntaxFlags: new Set([SyntaxFlag.ContrastColor, SyntaxFlag.Experimental]),
			};

			if (whiteContrast > blackContrast) {
				colorData.channels = [1, 1, 1];
			}

			return colorData;
		}
		case ColorNotation.A98_RGB: {
			const backgroundY = apca_adobeRGBtoY(XYZ_D50_to_a98_Gamut(colorData_to_XYZ_D50(backgroundColor).channels));

			const whiteContrast = Math.abs(apca_contrast(1, backgroundY));
			const blackContrast = Math.abs(apca_contrast(0, backgroundY));

			const colorData: ColorData = {
				colorNotation: ColorNotation.A98_RGB,
				channels: [0, 0, 0],
				alpha: 1,
				syntaxFlags: new Set([SyntaxFlag.ContrastColor, SyntaxFlag.Experimental]),
			};

			if (whiteContrast > blackContrast) {
				colorData.channels = [1, 1, 1];
			}

			return colorData;
		}
		default:
			// Should be unreachable
			return false;
	}
}
