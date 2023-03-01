import type { Color } from '@csstools/color-helpers';
import type { ColorData } from '../color';
import { SyntaxFlag } from '../color';
import { ColorSpace } from '../color-space';
import { FunctionNode } from '@csstools/css-parser-algorithms';
import { normalizeChannelValuesFn } from './normalize-channel-values';
export declare function threeChannelLegacySyntax(colorFunctionNode: FunctionNode, normalizeChannelValues: normalizeChannelValuesFn, sourceColorSpace: ColorSpace, sourceColorTo_XYZ: (color: Color) => Color, syntaxFlags: Array<SyntaxFlag>): ColorData | -1;
