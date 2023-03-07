import { xyz } from '@csstools/color-helpers';
import type { FunctionNode } from '@csstools/css-parser-algorithms';
import { ColorData } from '../color-data';
import type { ColorParser } from '../color-parser';
import { ColorSpace } from '../color-space';
import { normalize_HWB_ChannelValues } from './hwb-normalize-channel-values';
import { threeChannelSpaceSeparated } from './three-channel-space-separated';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function hwb(hwbNode: FunctionNode, colorParser: ColorParser): ColorData | false {
	{
		const output = hwbSpaceSeparated(hwbNode);
		if (output !== false) {
			return output;
		}
	}

	return false;
}

function hwbSpaceSeparated(hwbNode: FunctionNode): ColorData | false {
	return threeChannelSpaceSeparated(
		hwbNode,
		normalize_HWB_ChannelValues,
		ColorSpace.sRGB,
		xyz.HWB_to_XYZ_D50,
		[],
	);
}
