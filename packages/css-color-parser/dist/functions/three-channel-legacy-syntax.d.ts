import type { Color } from '@csstools/color-helpers';
import type { ColorData } from '../color';
import { ColorSpace } from '../color-space';
import { FunctionNode } from '@csstools/css-parser-algorithms';
import { normalizeChannelValueFn } from './normalize-channel-value';
export declare function threeChannelLegacySyntax(colorFunctionNode: FunctionNode, normalizeChannelValue: normalizeChannelValueFn, sourceColorSpace: ColorSpace, sourceColorTo_XYZ: (color: Color) => Color): ColorData | -1;
