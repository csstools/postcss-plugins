import type { FunctionNode } from '@csstools/css-parser-algorithms';
import { ColorData } from '../color-data';
import type { ColorParser } from '../color-parser';
export declare function hsl(hslNode: FunctionNode, colorParser: ColorParser): ColorData | -1;
