import type { ColorData } from '../color-data';
import type { ColorParser } from '../color-parser';
import type { FunctionNode } from '@csstools/css-parser-algorithms';
import { ColorNotation } from '../color-notation';
import { normalize_OKLCH_ChannelValues } from './oklch-normalize-channel-values';
import { threeChannelSpaceSeparated } from './three-channel-space-separated';

export function oklch(oklchNode: FunctionNode, colorParser: ColorParser): ColorData | false {
	return threeChannelSpaceSeparated(
		oklchNode,
		normalize_OKLCH_ChannelValues,
		ColorNotation.OKLCH,
		[],
		colorParser,
	);
}
