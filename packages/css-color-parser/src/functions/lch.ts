import type { ColorData } from '../color-data';
import type { ColorParser } from '../color-parser';
import type { FunctionNode } from '@csstools/css-parser-algorithms';
import { ColorNotation } from '../color-notation';
import { normalize_LCH_ChannelValues } from './lch-normalize-channel-values';
import { threeChannelSpaceSeparated } from './three-channel-space-separated';

export function lch(lchNode: FunctionNode, colorParser: ColorParser): ColorData | false {
	return threeChannelSpaceSeparated(
		lchNode,
		normalize_LCH_ChannelValues,
		ColorNotation.LCH,
		[],
		colorParser,
	);
}
