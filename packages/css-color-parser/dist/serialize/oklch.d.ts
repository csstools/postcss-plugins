import { ColorData } from '../color-data';
import { FunctionNode } from '@csstools/css-parser-algorithms';
/**
 * Convert color data to component values in the OKLCH color space.
 * The return value can be converted to a string by calling `toString()` on it.
 *
 * @param {ColorData} color - The color data to be serialized.
 * @returns {FunctionNode} The serialized color data as a FunctionNode object.
 */
export declare function serializeOKLCH(color: ColorData): FunctionNode;
