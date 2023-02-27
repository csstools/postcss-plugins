import { FunctionNode } from '@csstools/css-parser-algorithms';
import { ColorData } from './color';

export type ColorParser = (x: FunctionNode) => ColorData | -1;
