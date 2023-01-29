/**
 * For simplicity, this algorithm assumes that the hue has been normalized to a
 * number in the half-open range [0, 6), and the saturation and lightness have
 * been normalized to the range [0, 1]. It returns an array of three numbers
 * representing the red, green, and blue channels of the colors, normalized
 * to the range [0, 1]
 *
 * @license W3C https://www.w3.org/Consortium/Legal/2015/copyright-software-and-document
 *
 * @copyright This software or document includes material copied from or derived from https://github.com/w3c/csswg-drafts/blob/main/css-color-4/utilities.js. Copyright © 2022 W3C® (MIT, ERCIM, Keio, Beihang).
 *
 * @see https://github.com/w3c/csswg-drafts/blob/main/css-color-4/utilities.js
 */
export declare function HSLToRGB(hsl: Color): Color;
