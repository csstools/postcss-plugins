import { xyz } from '@csstools/color-helpers';
import type { FunctionNode } from '@csstools/css-parser-algorithms';
import { ColorData } from '../color-data';
import type { ColorParser } from '../color-parser';
import { ColorSpace } from '../color-space';
import { normalize_modern_HWB_ChannelValues } from './hwb-normalize-channel-values';
import { threeChannelSpaceSeparated } from './three-channel-space-separated';

export function hwb(hslNode: FunctionNode, colorParser: ColorParser): ColorData | -1 {
	{
		const output = hwbSpaceSeparated(hslNode);
		if (output !== -1) {
			return output;
		}
	}

	return -1;
}

function hwbSpaceSeparated(hslNode: FunctionNode): ColorData | -1 {
	return threeChannelSpaceSeparated(
		hslNode,
		normalize_modern_HWB_ChannelValues,
		ColorSpace.sRGB,
		xyz.HWB_to_XYZ_D50,
		[],
	);
}
