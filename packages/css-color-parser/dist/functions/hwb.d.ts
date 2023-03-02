import type { FunctionNode } from '@csstools/css-parser-algorithms';
import { ColorData } from '../color-data';
import type { ColorParser } from '../color-parser';
export declare function hwb(hslNode: FunctionNode, colorParser: ColorParser): ColorData | -1;
