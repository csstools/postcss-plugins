import type { FunctionNode } from '@csstools/css-parser-algorithms';
import { ColorData } from '../color-data';
import type { ColorParser } from '../color-parser';
import { ColorNotation } from '../color-notation';
import { threeChannelSpaceSeparated } from './three-channel-space-separated';
import { normalize_LCH_ChannelValues } from './lch-normalize-channel-values';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function lch(lchNode: FunctionNode, colorParser: ColorParser): ColorData | false {
	return threeChannelSpaceSeparated(
		lchNode,
		normalize_LCH_ChannelValues,
		ColorNotation.LCH,
		[],
	);
}
