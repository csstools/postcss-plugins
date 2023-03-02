import { xyz } from '@csstools/color-helpers';
import type { FunctionNode } from '@csstools/css-parser-algorithms';
import { ColorData, SyntaxFlag } from '../color-data';
import type { ColorParser } from '../color-parser';
import { ColorSpace } from '../color-space';
import { normalize_legacy_HSL_ChannelValues, normalize_modern_HSL_ChannelValues } from './hsl-normalize-channel-values';
import { threeChannelLegacySyntax } from './three-channel-legacy-syntax';
import { threeChannelSpaceSeparated } from './three-channel-space-separated';

export function hsl(hslNode: FunctionNode, colorParser: ColorParser): ColorData | -1 {
	{
		const output = hslCommaSeparated(hslNode);
		if (output !== -1) {
			return output;
		}
	}

	{
		const output = hslSpaceSeparated(hslNode);
		if (output !== -1) {
			return output;
		}
	}

	return -1;
}

function hslCommaSeparated(hslNode: FunctionNode): ColorData | -1 {
	return threeChannelLegacySyntax(
		hslNode,
		normalize_legacy_HSL_ChannelValues,
		ColorSpace.sRGB,
		xyz.HSL_to_XYZ_D50,
		[
			SyntaxFlag.LegacyHSL,
		],
	);
}

function hslSpaceSeparated(hslNode: FunctionNode): ColorData | -1 {
	return threeChannelSpaceSeparated(
		hslNode,
		normalize_modern_HSL_ChannelValues,
		ColorSpace.sRGB,
		xyz.HSL_to_XYZ_D50,
		[],
	);
}
