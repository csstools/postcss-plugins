import type { ColorParser } from '../color-parser';
import { ColorData } from '../color-data';
import { FunctionNode } from '@csstools/css-parser-algorithms';
export declare function colorMix(colorMixNode: FunctionNode, colorParser: ColorParser): ColorData | false;
