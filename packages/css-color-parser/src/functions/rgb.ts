import type { ColorData } from '../color-data';
import type { ColorParser } from '../color-parser';
import type { FunctionNode } from '@csstools/css-parser-algorithms';
import { ColorNotation } from '../color-notation';
import { SyntaxFlag } from '../color-data';
import { normalize_legacy_sRGB_ChannelValues, normalize_modern_sRGB_ChannelValues } from './rgb-normalize-channel-values';
import { threeChannelLegacySyntax } from './three-channel-legacy-syntax';
import { threeChannelSpaceSeparated } from './three-channel-space-separated';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function rgb(rgbNode: FunctionNode, colorParser: ColorParser): ColorData | false {
	{
		const output = rgbCommaSeparated(rgbNode);
		if (output !== false) {
			return output;
		}
	}

	{
		const output = rgbSpaceSeparated(rgbNode);
		if (output !== false) {
			return output;
		}
	}

	return false;
}

function rgbCommaSeparated(rgbNode: FunctionNode): ColorData | false {
	return threeChannelLegacySyntax(
		rgbNode,
		normalize_legacy_sRGB_ChannelValues,
		ColorNotation.RGB,
		[
			SyntaxFlag.LegacyRGB,
		],
	);
}

function rgbSpaceSeparated(rgbNode: FunctionNode): ColorData | false {
	return threeChannelSpaceSeparated(
		rgbNode,
		normalize_modern_sRGB_ChannelValues,
		ColorNotation.RGB,
		[],
	);
}
