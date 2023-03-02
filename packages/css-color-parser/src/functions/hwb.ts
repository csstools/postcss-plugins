import { xyz } from '@csstools/color-helpers';
import type { FunctionNode } from '@csstools/css-parser-algorithms';
import { ColorData } from '../color-data';
import type { ColorParser } from '../color-parser';
import { ColorSpace } from '../color-space';
import { normalize_modern_HWB_ChannelValues } from './hwb-normalize-channel-values';
import { threeChannelSpaceSeparated } from './three-channel-space-separated';

export function hwb(hwbNode: FunctionNode, colorParser: ColorParser): ColorData | -1 {
	{
		const output = hwbSpaceSeparated(hwbNode);
		if (output !== -1) {
			return output;
		}
	}

	return -1;
}

function hwbSpaceSeparated(hwbNode: FunctionNode): ColorData | -1 {
	return threeChannelSpaceSeparated(
		hwbNode,
		normalize_modern_HWB_ChannelValues,
		ColorSpace.sRGB,
		xyz.HWB_to_XYZ_D50,
		[],
	);
}
