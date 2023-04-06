import { ColorData } from '../color-data';
import { FunctionNode } from '@csstools/css-parser-algorithms';
import { Color } from '@csstools/color-helpers';
export declare function serializeRGB(color: ColorData, gamutMapping?: boolean): FunctionNode;
export declare function XYZ_D50_to_sRGB_Gamut(color: Color): Color;
