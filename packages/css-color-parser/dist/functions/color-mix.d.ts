import { FunctionNode } from '@csstools/css-parser-algorithms';
import { ColorData } from '../color-data';
import type { ColorParser } from '../color-parser';
export declare function colorMix(colorMixNode: FunctionNode, colorParser: ColorParser): ColorData | false;
