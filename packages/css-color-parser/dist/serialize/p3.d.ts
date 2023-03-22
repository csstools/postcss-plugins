import { ColorData } from '../color-data';
import { FunctionNode } from '@csstools/css-parser-algorithms';
import { Color } from '@csstools/color-helpers';
export declare function serializeP3(color: ColorData): FunctionNode;
export declare function XYZ_D50_to_P3_Gamut(color: Color): Color;
