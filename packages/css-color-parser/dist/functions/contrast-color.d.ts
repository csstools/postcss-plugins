import type { ColorData } from '../color-data';
import type { ColorParser } from '../color-parser';
import type { FunctionNode } from '@csstools/css-parser-algorithms';
export declare function contrastColor(colorMixNode: FunctionNode, colorParser: ColorParser): ColorData | false;
