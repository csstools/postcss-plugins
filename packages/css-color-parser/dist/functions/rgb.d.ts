import { FunctionNode } from '@csstools/css-parser-algorithms';
import { ColorData } from '../color';
import { ColorParser } from '../color-parser';
export declare function rgb(rgbNode: FunctionNode, colorParser: ColorParser): ColorData | -1;
