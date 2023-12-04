import type { ColorData } from './color-data';
import type { ComponentValue } from '@csstools/css-parser-algorithms';
export type { ColorData } from './color-data';
export { ColorNotation } from './color-notation';
export { SyntaxFlag } from './color-data';
export { colorDataTo, colorDataFitsRGB_Gamut, colorDataFitsDisplayP3_Gamut } from './color-data';
export { serializeP3 } from './serialize/p3';
export { serializeRGB } from './serialize/rgb';
export { serializeHSL } from './serialize/hsl';
export { serializeOKLCH } from './serialize/oklch';
/**
 * Convert a color function to a `ColorData` object.
 *
 * @param {ComponentValue} colorNode - The color function to be converted.
 * @returns {ColorData|false} The color function as a `ColorData` object or `false` if it could not be converted.
 */
export declare function color(colorNode: ComponentValue): ColorData | false;
