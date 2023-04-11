import type { ColorData } from '../color-data';
import type { ColorParser } from '../color-parser';
import type { FunctionNode } from '@csstools/css-parser-algorithms';
import { ColorNotation } from '../color-notation';
import { normalize_HWB_ChannelValues } from './hwb-normalize-channel-values';
import { threeChannelSpaceSeparated } from './three-channel-space-separated';

export function hwb(hwbNode: FunctionNode, colorParser: ColorParser): ColorData | false {
	return threeChannelSpaceSeparated(
		hwbNode,
		normalize_HWB_ChannelValues,
		ColorNotation.HWB,
		[],
		colorParser,
	);
}
