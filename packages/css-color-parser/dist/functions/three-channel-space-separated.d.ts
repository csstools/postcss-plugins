import type { Color } from '@csstools/color-helpers';
import type { ColorData } from '../color-data';
import { SyntaxFlag } from '../color-data';
import { ColorSpace } from '../color-space';
import { FunctionNode } from '@csstools/css-parser-algorithms';
import { normalizeChannelValuesFn } from './normalize-channel-values';
export declare function threeChannelSpaceSeparated(colorFunctionNode: FunctionNode, normalizeChannelValues: normalizeChannelValuesFn, sourceColorSpace: ColorSpace, sourceColorTo_XYZ: (color: Color) => Color, syntaxFlags: Array<SyntaxFlag>): ColorData | false;
