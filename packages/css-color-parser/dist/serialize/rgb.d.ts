import { ColorData } from '../color-data';
import { FunctionNode } from '@csstools/css-parser-algorithms';
/**
 * Convert color data to component values in the srgb color space.
 * The return value can be converted to a string by calling `toString()` on it.
 *
 * @param {ColorData} color - The color data to be serialized.
 * @param {boolean} gamutMapping - Whether to perform gamut mapping, defaults to `true`.
 * @returns {FunctionNode} The serialized color data as a FunctionNode object.
 */
export declare function serializeRGB(color: ColorData, gamutMapping?: boolean): FunctionNode;
