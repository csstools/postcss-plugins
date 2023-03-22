import type { ColorData } from '../color-data';
import type { ColorParser } from '../color-parser';
import { FunctionNode } from '@csstools/css-parser-algorithms';
export declare function color(colorNode: FunctionNode, colorParser: ColorParser): ColorData | false;
