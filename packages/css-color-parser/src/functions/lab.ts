import type { ColorData } from '../color-data';
import type { ColorParser } from '../color-parser';
import type { FunctionNode } from '@csstools/css-parser-algorithms';
import { ColorNotation } from '../color-notation';
import { normalize_Lab_ChannelValues } from './lab-normalize-channel-values';
import { threeChannelSpaceSeparated } from './three-channel-space-separated';

export function lab(labNode: FunctionNode, colorParser: ColorParser): ColorData | false {
	return threeChannelSpaceSeparated(
		labNode,
		normalize_Lab_ChannelValues,
		ColorNotation.Lab,
		[],
		colorParser,
	);
}
