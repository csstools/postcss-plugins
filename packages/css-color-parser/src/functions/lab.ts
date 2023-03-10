import type { ColorData } from '../color-data';
import type { ColorParser } from '../color-parser';
import type { FunctionNode } from '@csstools/css-parser-algorithms';
import { ColorSpace } from '../color-space';
import { threeChannelSpaceSeparated } from './three-channel-space-separated';
import { xyz } from '@csstools/color-helpers';
import { normalize_Lab_ChannelValues } from './lab-normalize-channel-values';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function lab(labNode: FunctionNode, colorParser: ColorParser): ColorData | false {
	return threeChannelSpaceSeparated(
		labNode,
		normalize_Lab_ChannelValues,
		ColorSpace.sRGB,
		xyz.Lab_to_XYZ_D50,
		[],
	);
}
