import type { ColorData } from '../color-data';
import type { ColorParser } from '../color-parser';
import type { FunctionNode } from '@csstools/css-parser-algorithms';
import { ColorNotation } from '../color-notation';
import { threeChannelSpaceSeparated } from './three-channel-space-separated';
import { normalize_Lab_ChannelValues } from './lab-normalize-channel-values';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function lab(labNode: FunctionNode, colorParser: ColorParser): ColorData | false {
	return threeChannelSpaceSeparated(
		labNode,
		normalize_Lab_ChannelValues,
		ColorNotation.Lab,
		[],
	);
}
