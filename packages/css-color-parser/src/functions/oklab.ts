import type { ColorData } from '../color-data';
import type { ColorParser } from '../color-parser';
import type { FunctionNode } from '@csstools/css-parser-algorithms';
import { ColorNotation } from '../color-notation';
import { threeChannelSpaceSeparated } from './three-channel-space-separated';
import { normalize_OKLab_ChannelValues } from './oklab-normalize-channel-values';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function oklab(oklabNode: FunctionNode, colorParser: ColorParser): ColorData | false {
	return threeChannelSpaceSeparated(
		oklabNode,
		normalize_OKLab_ChannelValues,
		ColorNotation.OKLab,
		[],
	);
}
