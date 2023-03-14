import type { ColorData } from '../color-data';
import { SyntaxFlag } from '../color-data';
import { ColorNotation } from '../color-notation';
import { FunctionNode } from '@csstools/css-parser-algorithms';
import { normalizeChannelValuesFn } from './normalize-channel-values';
export declare function threeChannelSpaceSeparated(colorFunctionNode: FunctionNode, normalizeChannelValues: normalizeChannelValuesFn, colorNotation: ColorNotation, syntaxFlags: Array<SyntaxFlag>): ColorData | false;
