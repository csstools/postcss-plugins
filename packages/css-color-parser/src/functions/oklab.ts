import type { ColorData } from '../color-data';
import type { ColorParser } from '../color-parser';
import type { FunctionNode } from '@csstools/css-parser-algorithms';
import { ColorNotation } from '../color-notation';
import { normalize_OKLab_ChannelValues } from './oklab-normalize-channel-values';
import { threeChannelSpaceSeparated } from './three-channel-space-separated';

export function oklab(oklabNode: FunctionNode, colorParser: ColorParser): ColorData | false {
	return threeChannelSpaceSeparated(
		oklabNode,
		normalize_OKLab_ChannelValues,
		ColorNotation.OKLab,
		[],
		colorParser,
	);
}
